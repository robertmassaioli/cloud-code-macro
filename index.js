var express = require('express');
var _ = require('lodash');
var bunyan = require('express-bunyan-logger');
var mustacheExpress = require('mustache-express');
const fs = require('fs');
const sanitize = require("sanitize-filename");
var app = express();

// JSON Logging
var obfuscate = [
    'req.headers.cookie',
    'req.headers.referer',
    'referer',
    'msg'
];

app.use(bunyan({
   obfuscate: obfuscate
}));
app.use(bunyan.errorLogger({
   obfuscate: obfuscate
}));

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
        case "staging.public.atl-paas.net":
           return zones.dog;

        case "useast.atlassian.io":
        case "uswest.atlassian.io":
        case "prod.public.atl-paas.net":
           return zones.prod;

        case "domain.dev.atlassian.io":
        case "application.dev.atlassian.io":
        case "platform.dev.atlassian.io":
        case "dev.public.atl-paas.net":
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
  res.redirect('/docs/home');
});

var pluginKey = 'com.atlassian.connect.better-code-macro' + getKeySuffixFromZone(microsZone);

app.get('/atlassian-connect.json', function(req, res) {
   res.json({
      name: 'Better Code Macro for Confluence',
      key: pluginKey,
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
      apiMigrations: {
        gdpr: true
      },
      scopes: ["read"],
      modules: {
         dynamicContentMacros: [{
            key: 'bitbucket-snippet-code-macro',
            name: {
               value: 'Bitbucket snippet macro'
            },
            url: '/macro/bitbucket-snippet-code-macro?snippetUrl={snippetUrl}',
            icon: {
               width: 80,
               height: 80,
               url: '/static/images/bitbucket/bitbucket-logo-80px.png'
            },
            documentation: {
               url: '/docs/bitbucket-snippets'
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
            icon: {
               width: 80,
               height: 80,
               url: '/static/images/github/GitHub-Mark-80px.png'
            },
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
            url: '/macro/paste-code-macro?page_id={page.id}&macro_id={macro.id}&page_version={page.version}&output_type={output.type}&theme={theme}&language={language}&title={title}',
            description: {
               value: 'Better macro to format blocks of source code or markup.'
            },
            icon: {
               width: 80,
               height: 80,
               url: '/static/images/cloud-code-macro-paste-icon.png'
            },
            documentation: {
               url: '/docs/paste-code-macro'
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
            }, {
               identifier: 'title',
               name: {
                  value: 'Title'
               },
               description: {
                  value: 'An optional title for your code black.'
               },
               type: 'string',
               required: false,
            }, {
               identifier: 'theme',
               name: {
                  value: 'Theme'
               },
               description: {
                  value: 'Choose the theme for your code.'
               },
               type: 'enum',
               required: false,
               values: _.map(avaliableStyles, prettyStyleName),
               defaultValue: prettyStyleName('github-gist')
            }],
         }]
      }
   });
});

app.get('/macro/paste-code-macro', function(req, res) {
   var toTheme = function(s) { return { theme: s }; };
   res.render('paste-code-macro', {
      avaliableStyles: _.map(avaliableStyles, toTheme)
   });
});

app.get('/macro/gist-code-macro', function(req, res) {
   var gistUrl = new URL(req.query.gistUrl || '');
   if (gistUrl.hostname !== 'gist.github.com') {
      gistUrl = 'https://gist.github.com/robertmassaioli/ef414358f703318cf24616513aad185b';
   }

   res.render('gist-code-macro', {
       gistUrl: gistUrl + '.js'
   });
});

app.get('/macro/bitbucket-snippet-code-macro', function(req, res) {
   var snippetUrl = new URL(req.query.snippetUrl || '');
   if (snippetUrl.hostname !== 'bitbucket.org') {
      snippetUrl = 'https://bitbucket.org/snippets/atlassian/AeBxKn';
   }

   res.render('bitbucket-snippet-code-macro', {
       snippetUrl: snippetUrl
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

app.param('docsFile', function(req, res, next, docsFile) {
   req.docsFile = sanitize(docsFile);
   next();
});

app.get('/docs/:docsFile', function(req, res) {
   fs.readFile('docs/' + req.docsFile + '.md', function(err, data) {
      if(err) {
         fs.readFile('docs/not-found.md', function(err, data) {
            if(err) {
               res.sendStatus(404);
            } else {
               res.render('docs', {
                  markdownContent: data
               });
            }
         });
      } else {
         res.render('docs', {
            markdownContent: data
         });
      }
   });
});

var prettyStyleName = function(s) {
   var upperLocations = [];
   var currentLocation = 0;
   while(currentLocation >= 0) {
      currentLocation = s.indexOf('-', currentLocation + 1);
      if(currentLocation > 0) upperLocations.push(currentLocation);
   }

   var finalName = s[0].toUpperCase();
   var lastPos = 1;
   for(var i = 0; i < upperLocations.length; ++i) {
      finalName += s.substring(lastPos, upperLocations[i]) + ' ' + s[upperLocations[i] + 1].toUpperCase();
      lastPos = upperLocations[i] + 2;
   }
   finalName += s.substring(lastPos);

   return finalName;
};

// These values were generated by cd'ing into the highlight.js/src/styles directory
// and running: ls -1 *.css | sed 's_.css_",_' | sed 's_^_"_' | pbcopy
var avaliableStyles = [
   "agate",
   "androidstudio",
   "arduino-light",
   "arta",
   "ascetic",
   "atelier-cave-dark",
   "atelier-cave-light",
   "atelier-dune-dark",
   "atelier-dune-light",
   "atelier-estuary-dark",
   "atelier-estuary-light",
   "atelier-forest-dark",
   "atelier-forest-light",
   "atelier-heath-dark",
   "atelier-heath-light",
   "atelier-lakeside-dark",
   "atelier-lakeside-light",
   "atelier-plateau-dark",
   "atelier-plateau-light",
   "atelier-savanna-dark",
   "atelier-savanna-light",
   "atelier-seaside-dark",
   "atelier-seaside-light",
   "atelier-sulphurpool-dark",
   "atelier-sulphurpool-light",
   "brown-paper",
   "codepen-embed",
   "color-brewer",
   "dark",
   "darkula",
   "default",
   "docco",
   "dracula",
   "far",
   "foundation",
   "github-gist",
   "github",
   "googlecode",
   "grayscale",
   "gruvbox-dark",
   "gruvbox-light",
   "hopscotch",
   "hybrid",
   "idea",
   "ir-black",
   "kimbie.dark",
   "kimbie.light",
   "magula",
   "mono-blue",
   "monokai-sublime",
   "monokai",
   "obsidian",
   "paraiso-dark",
   "paraiso-light",
   "pojoaque",
   "qtcreator_dark",
   "qtcreator_light",
   "railscasts",
   "rainbow",
   "school-book",
   "solarized-dark",
   "solarized-light",
   "sunburst",
   "tomorrow-night-blue",
   "tomorrow-night-bright",
   "tomorrow-night-eighties",
   "tomorrow-night",
   "tomorrow",
   "vs",
   "xcode",
   "zenburn"
];

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
