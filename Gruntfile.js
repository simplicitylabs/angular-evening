module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '',
        banner: grunt.file.read('src/evening/evening.prefix'),
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      library: {
        src: [
        'src/**/*.module.js',
        'src/**/*.provider.js',
        'src/**/*.factory.js',
        'src/evening/evening.suffix'
        ],
        dest: 'dist/angular-evening.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      jid: {
        files: {
          'dist/angular-evening.min.js': ['<%= concat.library.dest %>']
        }
      }
    },
    jshint: {
      beforeConcat: {
        src: ['gruntfile.js', 'angularEvening/**/*.js']
      },
      afterConcat: {
        src: [
        '<%= concat.library.dest %>'
        ]
      },
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          angular: true
        },
        globalstrict: false
      }
    },
    watch: {
      options: {
        livereload: true
      },
      files: [
      'Gruntfile.js',
      'src/**/*'
      ],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'jshint:beforeConcat',
    'concat',
    'jshint:afterConcat',
    'uglify',
  ]);
  grunt.registerTask('livereload', ['default', 'watch']);

};
