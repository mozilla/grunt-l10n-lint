/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const grunt = require('grunt');
const extractUntranslated = require('../lib/extract-untranslated');

exports.extract_untranslated = {
  untranslated: function (test) {
    var contents =
          grunt.file.read('test/fixtures/templates/client.pot');
    var untranslated = extractUntranslated(contents);

    var expectedUntranslated =
          grunt.file.readJSON('test/expected/client-pot-untranslated.json');
    test.deepEqual(untranslated, expectedUntranslated);

    test.done();
  }
};

