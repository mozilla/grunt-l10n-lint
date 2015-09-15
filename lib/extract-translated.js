/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Convert the contents of a PO file to a list of translated strings.
 */

const gettextParser = require('gettext-parser');

module.exports = function (contents) {
  var translationObj = gettextParser.po.parse(contents);
  var translations = translationObj.translations[''];

  var translatedStrings = Object.keys(translations).reduce(function (accumulator, untranslated) {
    // the first entry is '', this is meta information about the
    // translation. Ignore it.
    if (untranslated && untranslated.length) {
      var allTranslations = translations[untranslated].msgstr;
      accumulator = accumulator.concat(allTranslations);
    }

    return accumulator;
  }, []).filter(function (translation) {
    return !! (translation && translation.length);
  });

  return translatedStrings;
};
