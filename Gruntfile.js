var _ = require('lodash');

module.exports = function(grunt) {
   var expressRoot = 'index.js';

   var toName = function(s) {
      return { name: s };
   };

   var jsModules = [
      'app/paste-code-macro',
      'app/gist-code-macro',
      'app/bitbucket-snippet-code-macro'
   ];

   var buildJsOptions = {
      optimize: 'none',
      appDir: 'static/js',
      baseUrl: '.',
      dir: 'static-js',
      paths: {
         underscore: 'lib/underscore'
      },
      shim: {
         'jquery': {
            deps: [],
            exports: '$'
         },
         'aui': {
            'deps': ['jquery'],
            'exports': 'AJS'
         }
      },
      wrapShim: true,
      modules: _.map(jsModules, toName)
   };

   var prodJsOptions = _.merge({}, buildJsOptions, {
      optimize: 'uglify2'
   });

   var buildCssOptions = {
      files: {
         "static-css/all.css": "static/less/all.less"
      }
   };

   var prodCssOptions = _.merge({}, buildCssOptions, {
      options: {
         compress: true
      }
   });

   grunt.initConfig({
      express: {
         options: {
            // Override defaults here
         },
         dev: {
            options: {
               script: expressRoot
            }
         }
      },
      requirejs: {
         compile: {
            options: buildJsOptions
         },
         prod: {
            options: prodJsOptions
         }
      },
      less: {
         compile: buildCssOptions,
         prod: prodCssOptions
      },
      jshint: {
         files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
         options: {
            globals: {
               jQuery: true
            }
         }
      },
      watch: {
         express: {
            files: [ 
               'Gruntfile.js',
               expressRoot,
               'views/*.mustache'
            ],
            tasks: [ 'express:dev' ],
            options: {
               spawn: false
            }
         },
         requirejs: {
            files: [ 
               'Gruntfile.js',
               'static/js/**/*.js' 
            ],
            tasks: [ 'requirejs:compile' ]
         },
         less: {
            files: [ 'static/less/**/*.less' ],
            tasks: [ 'less:compile' ]
         },
         jshint: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-requirejs');
   grunt.loadNpmTasks('grunt-contrib-less');
   grunt.loadNpmTasks('grunt-express-server');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-watch');

   grunt.registerTask('default', [
      'requirejs:compile', 
      'less:compile', 
      'express:dev', 
      'watch'
   ]);
};
