module.exports = function(grunt) {
   var expressRoot = 'index.js';

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
      //'requirejs:compile', 
      //'less:compile', 
      'express:dev', 
      'watch'
   ]);
};
