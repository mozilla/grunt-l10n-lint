/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Save a list of all HTML tags, attributes and their values from the list
 * of untranslatedStrings.
 *
 * A 3D hash is used to keep track of tags, their attributes, and attribute
 * values.
 *
 * Example for an anchor element with multiple possible hrefs:
 * tagData = {
 *   "a": {
 *     "href": {
 *       "/signin": true,
 *       "/signup": true
 *     }
 *   }
 * }
 */

const gettextParser = require('gettext-parser');
const htmlparser = require('htmlparser2');

function saveTagData(tagData, tagName, attribs) {
  if (! tagData.hasOwnProperty(tagName)) {
    tagData[tagName] = {};
  }

  for (var attribName in attribs) {
    if (! tagData[tagName].hasOwnProperty(attribName)) {
      tagData[tagName][attribName] = {};
    }

    var attribValue = attribs[attribName];
    tagData[tagName][attribName][attribValue] = true;
  }
}

module.exports = function (untranslatedStrings) {
  var tagData = {};

  var htmlParser = new htmlparser.Parser({
    onopentag: saveTagData.bind(null, tagData)
  }, {
    decodeEntities: true,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false,
    recognizeCDATA: false,
    recognizeSelfClosing: false,
    xmlNode: false
  });

  untranslatedStrings.forEach(htmlParser.write, htmlParser);

  htmlParser.end();

  return tagData;
};

