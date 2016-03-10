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
            key: 'bitbucket-snippet-code-macro',
            name: {
               value: 'Bitbucket snippet macro'
            },
            url: '/macro/bitbucket-snippet-code-macro?snippetUrl={snippetUrl}',
            documentation: {
               url: '/docs/bitbucket-snippet-code-macro'
            },
            categories: [
               'development',
               'external-content'
            ],
            outputType: 'block',
            bodyType: 'none',
            aliases: [
               'snippet',
               'bbsnippet',
               'bitbucket',
            ],
            featured: false,
            parameters: [{
               identifier: 'snippetUrl',
               name: {
                  value: 'Snippet url'
               },
               type: 'string',
               required: true,
               multiple: false,
               hidden: true
            }],
            autoconvert: {
               urlParameter: 'snippetUrl',
               matchers: [{
                  pattern: 'https://bitbucket.org/snippets/{}/{}'
               }, {
                  pattern: 'https://bitbucket.org/snippets/{}/{}/{}'
               }]
            },
            hidden: true
         }, {
            key: 'gist-code-macro',
            name: {
               value: 'GitHub gist macro'
            },
            url: '/macro/gist-code-macro?gistUrl={gistUrl}',
            documentation: {
               url: '/docs/gist-code-macro'
            },
            categories: [
               'development',
               'external-content'
            ],
            outputType: 'block',
            bodyType: 'none',
            aliases: [ 'gist' ],
            featured: false,
            parameters: [{
               identifier: 'gistUrl',
               name: {
                  value: 'Gist url'
               },
               type: 'string',
               required: true,
               multiple: false,
               hidden: true
            }],
            autoconvert: {
               urlParameter: 'gistUrl',
               matchers: [{
                  pattern: 'https://gist.github.com/{}/{}'
               }]
            },
            hidden: true
         }, {
            key: 'paste-code-macro',
            name: {
               value: 'Better Code Block'
            },
            url: '/macro/paste-code-macro?page_id={page.id}&macro_id={macro.id}&page_version={page.version}&output_type={output.type}',
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
            parameters: [{
               identifier: 'language',
               name: {
                  value: 'Language'
               },
               description: {
                  value: 'Choose the programming / markup language for your code explicitly.'
               },
               type: 'enum',
               required: false,
               // These values were generated by cd'ing into the highlight.js/src/language directory
               // and running: ls -1 | sed 's_.js_",_' | sed 's_^_"_' | pbcopy
               values: [
                  "1c",
                  "accesslog",
                  "actionscript",
                  "apache",
                  "applescript",
                  "arduino",
                  "armasm",
                  "asciidoc",
                  "aspectj",
                  "autohotkey",
                  "autoit",
                  "avrasm",
                  "axapta",
                  "bash",
                  "basic",
                  "brainfuck",
                  "cal",
                  "capnproto",
                  "ceylon",
                  "clojure-repl",
                  "clojure",
                  "cmake",
                  "coffeescript",
                  "cos",
                  "cpp",
                  "crmsh",
                  "crystal",
                  "cs",
                  "csp",
                  "css",
                  "d",
                  "dart",
                  "delphi",
                  "diff",
                  "django",
                  "dns",
                  "dockerfile",
                  "dos",
                  "dts",
                  "dust",
                  "elixir",
                  "elm",
                  "erb",
                  "erlang-repl",
                  "erlang",
                  "fix",
                  "fortran",
                  "fsharp",
                  "gams",
                  "gauss",
                  "gcode",
                  "gherkin",
                  "glsl",
                  "go",
                  "golo",
                  "gradle",
                  "groovy",
                  "haml",
                  "handlebars",
                  "haskell",
                  "haxe",
                  "hsp",
                  "htmlbars",
                  "http",
                  "inform7",
                  "ini",
                  "irpf90",
                  "java",
                  "javascript",
                  "json",
                  "julia",
                  "kotlin",
                  "lasso",
                  "less",
                  "lisp",
                  "livecodeserver",
                  "livescript",
                  "lua",
                  "makefile",
                  "markdown",
                  "mathematica",
                  "matlab",
                  "maxima",
                  "mel",
                  "mercury",
                  "mipsasm",
                  "mizar",
                  "mojolicious",
                  "monkey",
                  "nginx",
                  "nimrod",
                  "nix",
                  "nsis",
                  "objectivec",
                  "ocaml",
                  "openscad",
                  "oxygene",
                  "parser3",
                  "perl",
                  "pf",
                  "php",
                  "powershell",
                  "processing",
                  "profile",
                  "prolog",
                  "protobuf",
                  "puppet",
                  "python",
                  "q",
                  "qml",
                  "r",
                  "rib",
                  "roboconf",
                  "rsl",
                  "ruby",
                  "ruleslanguage",
                  "rust",
                  "scala",
                  "scheme",
                  "scilab",
                  "scss",
                  "smali",
                  "smalltalk",
                  "sml",
                  "sqf",
                  "sql",
                  "stan",
                  "stata",
                  "step21",
                  "stylus",
                  "swift",
                  "taggerscript",
                  "tcl",
                  "tex",
                  "thrift",
                  "tp",
                  "twig",
                  "typescript",
                  "vala",
                  "vbnet",
                  "vbscript-html",
                  "vbscript",
                  "verilog",
                  "vhdl",
                  "vim",
                  "x86asm",
                  "xl",
                  "xml",
                  "xquery",
                  "yaml",
                  "zephir"
               ],
               hidden: false
            }],
         }]
      }
   });
});

app.get('/macro/paste-code-macro', function(req, res) {
   res.render('paste-code-macro');
});

app.get('/macro/gist-code-macro', function(req, res) {
   res.render('gist-code-macro', {
       gistUrl: req.query.gistUrl + '.js'
   });
});

app.get('/macro/bitbucket-snippet-code-macro', function(req, res) {
   res.render('bitbucket-snippet-code-macro', {
       snippetUrl: req.query.snippetUrl
   });
});

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
