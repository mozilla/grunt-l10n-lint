/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Convert the contents of a PO file to a list of untranslated strings.
 */

const gettextParser = require('gettext-parser');

module.exports = function (contents) {
  var translations = gettextParser.po.parse(contents);
  return Object.keys(translations.translations['']).filter(function (untranslated) {
    // filter out empty strings.
    return untranslated && untranslated.length;
  });
};


