/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    eslint: {
      options: {
        eslintrc: '.eslintrc'
      },
      all: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ]
    },

    'l10n-lint': {
      test: {
        options: {
          untranslated: ['test/fixtures/templates/**/*.pot']
        },
        files: [{
          src: 'test/fixtures/**/*.po'
        }]
      }
    },

    nodeunit: {
      tests: ['test/*-test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['nodeunit']);
};

