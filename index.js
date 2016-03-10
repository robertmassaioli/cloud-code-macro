var express = require('express');
var bunyan = require('express-bunyan-logger');
var mustacheExpress = require('mustache-express');
var app = express();

// JSON Logging
app.use(bunyan());
app.use(bunyan.errorLogger());

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Variables for setting up this addon
var serverPort = process.env.PORT || 3000;
var hostUrl = process.env.HOST_URL || "http://localhost:" + serverPort;

var zones = {
   local: 0,
   dev: 1,
   dog: 2,
   prod: 3
};

var zoneFromString = function(zone) {
   switch(zone) {
      case "useast.staging.atlassian.io":
      case "uswest.staging.atlassian.io":
         return zones.dog;

      case "useast.atlassian.io":
      case "uswest.atlassian.io":
         return zones.prod;

      case "domain.dev.atlassian.io":
      case "application.dev.atlassian.io":
      case "platform.dev.atlassian.io":
         return zones.dev;
   }
   
   return zones.local;
};

var getKeySuffixFromZone = function(zone) {
   switch(zone) {
      case zones.local:
         return '.local';
      case zones.dev:
         return '.dev';
      case zones.dog:
         return '.dog';
      case zones.prod: 
         return '.prod';
   }

   return '';
};

var microsZone = zoneFromString(process.env.ZONE);

// Register static variables
app.use('/static/images', express.static('static/images'));
app.use('/static/js', express.static('static-js'));
app.use('/static/css', express.static('static-css'));
app.use('/static/ace', express.static('static/ace'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});

app.get('/atlassian-connect.json', function(req, res) {
   res.json({
      name: 'Better Code Macro for Confluence',
      key: 'com.atlassian.connect.better-code-macro' + getKeySuffixFromZone(microsZone),
      version: "1.0",
      description: 'A better code macro for Confluence cloud.',
      vendor: {
         name: 'Atlassian',
         url: 'http://www.atlassian.com'
      },
      baseUrl: hostUrl,
      authentication: {
         type: "none"
      },
      scopes: ["read"],
      modules: {
         dynamicContentMacros: [{
            key: 'paste-code-macro',
            name: {
               value: 'Better Code Block'
            },
            url: '/macro/paste-code-macro?page_id={page.id}&macro_id={macro.id}&page_version={page.version}',
            description: {
               value: 'Better macro to format blocks of source code or markup.'
            },
            // TODO icon support
            documentation: {
               url: '/docs/paste-code-macro.html'
            },
            // TODO use external content for the snippets and gist macros
            categories: [
               'development',
               'formatting'
            ],
            outputType: 'block',
            bodyType: 'plain-text',
            aliases: [
               'bettercode',
               'codebetter',
               'bcode'
            ],
            featured: true,
            parameters: [
            ],
         }]
      }
   });
});

app.get('/macro/paste-code-macro', function(req, res) {
   res.render('paste-code-macro');
});

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
