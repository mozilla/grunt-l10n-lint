/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const grunt = require('grunt');
const extractTranslated = require('../lib/extract-translated');

exports.extract_translated = {
  translated: function (test) {
    var contents =
          grunt.file.read('test/fixtures/translated/good/client.po');

    var translated = extractTranslated(contents);

    var expectedTranslated =
          grunt.file.readJSON('test/expected/client-po-translated.json');
    test.deepEqual(translated, expectedTranslated);

    test.done();
  }
};

