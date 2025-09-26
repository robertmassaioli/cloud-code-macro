import express from 'express';
import ExpressPinoLogger from 'express-pino-logger';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// JSON Logging
const obfuscate = [
    'req.headers.cookie',
    'req.headers.referer',
    'referer',
    'msg'
];

const pino = ExpressPinoLogger({
   redact: obfuscate
});

app.use(pino);

// Static HTML views - no template engine needed

// Variables for setting up this addon
const serverPort = process.env.PORT || 3000;
const hostUrl = process.env.HOST_URL || `http://localhost:${serverPort}`;

const zones = {
   local: 0,
   dev: 1,
   dog: 2,
   prod: 3
};

const zoneFromString = (zone) => {
    switch(zone) {
        case "staging":
           return zones.dog;
        case "prod":
           return zones.prod;
        case "dev":
           return zones.dev;
        default:
           return zones.local;
     }
};

const getKeySuffixFromZone = (zone) => {
   switch(zone) {
      case zones.local:
         return '.local';
      case zones.dev:
         return '.dev';
      case zones.dog:
         return '.dog';
      case zones.prod:
         return '.prod';
      default:
         return '';
   }
};

const microsZone = zoneFromString(process.env.MICROS_ENVTYPE);

// Register static assets
app.use('/static/images', express.static('static/images'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.redirect('/docs/home');
});

const pluginKey = `com.atlassian.connect.better-code-macro${getKeySuffixFromZone(microsZone)}`;

// Single deprecation page handler
const serveDeprecationPage = async (req, res) => {
   try {
      const data = await fs.readFile(path.join(__dirname, 'views', 'deprecation.html'), 'utf8');
      res.send(data);
   } catch (err) {
      res.status(500).send('Error loading page');
   }
};

// All macro routes serve the same deprecation message
app.get('/macro/paste-code-macro', serveDeprecationPage);
app.get('/macro/gist-code-macro', serveDeprecationPage);
app.get('/macro/bitbucket-snippet-code-macro', serveDeprecationPage);
app.get('/docs/:docsFile', serveDeprecationPage);

app.get('/rest/heartbeat', (req, res) => {
   res.sendStatus(200);
});

app.get('/redirect/install', (req, res) => {
   res.redirect(`https://marketplace.atlassian.com/plugins/${pluginKey}`);
});

app.get('/redirect/raise-issue', (req, res) => {
   res.redirect('https://bitbucket.org/robertmassaioli/cloud-code-macro/issues/new');
});


const server = app.listen(serverPort, () => {
   const address = server.address();
   if (address) {
      const host = address.address === '::' ? 'localhost' : address.address;
      const port = address.port;
      console.log(`Better Code Macro deprecation service listening at http://${host}:${port}`);
   } else {
      console.log(`Better Code Macro deprecation service listening on port ${serverPort}`);
   }
});

server.on('error', (err) => {
   console.error('Server error:', err.message);
});

export default app;
