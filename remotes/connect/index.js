var express = require('express');
var ExpressPinoLogger = require('express-pino-logger');
const fs = require('fs');
const path = require('path');
var app = express();

// JSON Logging
var obfuscate = [
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
        case "staging":
           return zones.dog;

        case "prod":
           return zones.prod;

        case "dev":
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

var microsZone = zoneFromString(process.env.MICROS_ENVTYPE);

// Register static assets
app.use('/static/images', express.static('static/images'));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.redirect('/docs/home');
});

var pluginKey = 'com.atlassian.connect.better-code-macro' + getKeySuffixFromZone(microsZone);

app.get('/macro/paste-code-macro', function(req, res) {
   fs.readFile(path.join(__dirname, 'views', 'paste-code-macro.html'), 'utf8', function(err, data) {
      if (err) {
         res.status(500).send('Error loading page');
      } else {
         res.send(data);
      }
   });
});

app.get('/macro/gist-code-macro', function(req, res) {
   fs.readFile(path.join(__dirname, 'views', 'gist-code-macro.html'), 'utf8', function(err, data) {
      if (err) {
         res.status(500).send('Error loading page');
      } else {
         res.send(data);
      }
   });
});

app.get('/macro/bitbucket-snippet-code-macro', function(req, res) {
   fs.readFile(path.join(__dirname, 'views', 'bitbucket-snippet-code-macro.html'), 'utf8', function(err, data) {
      if (err) {
         res.status(500).send('Error loading page');
      } else {
         res.send(data);
      }
   });
});

app.get('/rest/heartbeat', function(req, res) {
   res.sendStatus(200);
});

/*
    [ ("/redirect/raise-issue", SC.redirect "https://ecosystem.atlassian.net/secure/RapidBoard.jspa?rapidView=192")
    , ("/redirect/install", SC.redirect "")
    , ("/redirect/jira-signup", SC.redirect "https://www.atlassian.com/ondemand/signup/?product=jira-core.ondemand")
*/
app.get('/redirect/install', function(req, res) {
   res.redirect('https://marketplace.atlassian.com/plugins/' + pluginKey);
});

app.get('/redirect/raise-issue', function(req, res) {
   res.redirect('https://bitbucket.org/robertmassaioli/cloud-code-macro/issues/new');
});

app.get('/docs/:docsFile', function(req, res) {
   fs.readFile(path.join(__dirname, 'views', 'docs.html'), 'utf8', function(err, data) {
      if (err) {
         res.status(500).send('Error loading page');
      } else {
         res.send(data);
      }
   });
});


var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;
