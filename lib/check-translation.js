/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Check translations for any unexpected HTML.
 *
 * Runs the translation through an HTML parser.
 * For each tag that is found, check the tag, it's attributes
 * and attribute values against a list of allowed values.
 *
 * If anything doens't match up, throw an error.
 */

'use strict';

var htmlparser = require('htmlparser2');

function MalformedHTMLError (tagName) {
  this.tagName = tagName;
  this.message = 'Malformed HTML';
  Error.call(this);
}
MalformedHTMLError.prototype = new Error();

function UnexpectedTagError (tagName) {
  this.tagName = tagName;
  this.message = 'Unexpected tag: ' + tagName;
  Error.call(this);
}
UnexpectedTagError.prototype = new Error();

function UnexpectedAttributeError (tagName, attributeName) {
  this.tagName = tagName;
  this.attributeName = attributeName;
  this.message = 'Unexpected attribute: ' + attributeName;
  Error.call(this);
}
UnexpectedAttributeError.prototype = new Error();

function UnexpectedAttributeValueError (tagName, attributeName, attributeValue) {
  this.tagName = tagName;
  this.attributeName = attributeName;
  this.attributeValue = attributeValue;
  this.message = 'Unexpected attribute value: ' + attributeName + '=' + attributeValue;
  Error.call(this);
}
UnexpectedAttributeValueError.prototype = new Error();


function CheckTranslation(translation, expectedTagsData, callback) {
  this._translation = translation;
  this._expectedTagsData = expectedTagsData;
  this._callback = callback;

  this._openTagStack = [];

  try {
    this._errorIfUnmatchedBrackets();
    this._errorIfEmptyTagName();
  } catch (err) {
    this._finish(err);
    return;
  }

  this._parser = new htmlparser.Parser({
    onerror: this._onParserError.bind(this),
    onopentag: this._onOpenTag.bind(this)
  }, {
    decodeEntities: true,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false,
    recognizeCDATA: false,
    recognizeSelfClosing: true,
    xmlNode: false
  });

  /**
   * The onclosetag callback specified in config is only called
   * for valid HTML. The parser's onclosetag function is called
   * on every closing tag, event for invalid HTML.
   */
  this._onclosetag = this._parser.onclosetag;
  this._parser.onclosetag = this._onCloseTag.bind(this);

  this._parser.write(translation);

  // any outstanding tags that weren't closed?
  if (! this._done) {
    try {
      this._errorIfTagStillOpen();
    } catch (err) {
      this._finish(err);
      return;
    }
  }

  if (! this._done) {
    this._finish(null);
  }
}

CheckTranslation.prototype = {
  constructor: CheckTranslation,

  /**
   * Tags that are currently open. If tags are closed out
   * of order or left open, then error.
   */
  _openTagStack: null,

  _done: false,
  _finish: function (status) {
    this._done = true;

    if (this._parser) {
      this._parser.end();
    }

    this._callback(status);
  },

  _countOccurrances: function (needle, haystack) {
    var regExp = new RegExp(needle, 'g');
    var found; //eslint-disable-line no-unused-vars

    var count = 0;
    while ((found = regExp.exec(haystack)) !== null) {
      count++;
    }

    return count;
  },

  _errorIfUnmatchedBrackets: function () {
    var translation = this._translation;

    var openTagCount = this._countOccurrances('<', translation);
    var closeTagCount = this._countOccurrances('>', translation);

    if (openTagCount !== closeTagCount) {
      throw new MalformedHTMLError(translation);
    }
  },

  _errorIfEmptyTagName: function () {
    var translation = this._translation;
    if (/<\s?\/?\s?>/.test(translation)) {
      throw new MalformedHTMLError(translation);
    }
  },

  _errorIfUnexpectedTag: function (tagName) {
    if (! this._expectedTagsData.hasOwnProperty(tagName)) {
      throw new UnexpectedTagError(tagName);
    }
  },

  _errorIfUnexpectedAttribute: function (tagName, attributeName) {
    var expectedTagAttributes = this._expectedTagsData[tagName];
    if (! expectedTagAttributes.hasOwnProperty(attributeName)) {
      throw new UnexpectedAttributeError(tagName, attributeName);
    }
  },

  _errorIfUnexpectedAttributeValue: function (tagName, attributeName, attributeValue) {
    var expectedTagAttributes = this._expectedTagsData[tagName];
    var expectedAttributeValues = expectedTagAttributes[attributeName];
    if (! expectedAttributeValues.hasOwnProperty(attributeValue)) {
      throw new UnexpectedAttributeValueError(tagName, attributeName, attributeValue);
    }
  },

  _errorIfMismatchedOpenAndCloseTags: function (closeTag) {
    /*
     * Check the tag being closed against the most recently opened
     * tag. If they are not the same, invalid HTML.
     */
    var lastOpenedTag = this._openTagStack.pop();
    if (closeTag !== lastOpenedTag) {
      throw new MalformedHTMLError(this._translation);
    }
  },

  _errorIfTagStillOpen: function () {
    if (this._openTagStack.length) {
      throw new MalformedHTMLError(this._translation);
    }
  },

  _onParserError: function (err) {
    if (this._done) {
      return;
    }

    this._finish(err);
  },

  /**
   * Check all tags, attributes, and attriute values against
   * the allowed list in expectedTagsData.
   */
  _onOpenTag: function (tagName, tagAttributes) {
    if (this._done) {
      return;
    }

    this._openTagStack.push(tagName);

    try {
      this._errorIfUnexpectedTag(tagName);

      for (var attributeName in tagAttributes) {
        var attributeValue = tagAttributes[attributeName];

        this._errorIfUnexpectedAttribute(tagName, attributeName);
        this._errorIfUnexpectedAttributeValue(tagName, attributeName, attributeValue);
      }
    } catch (err) {
      this._finish(err);
    }
  },

  _onCloseTag: function (tagName) {
    this._onclosetag.apply(this._parser, arguments);

    if (this._done) {
      return;
    }

    /*
     * Check the tag being closed against the most recently opened
     * tag. If they are not the same, invalid HTML.
     */
    try {
      this._errorIfMismatchedOpenAndCloseTags(tagName);
    } catch (err) {
      this._finish(err);
    }
  }
};

exports.checkTranslation = function (translation, expectedTagsData, callback) {
  return new CheckTranslation(translation, expectedTagsData, callback);
};

exports.MalformedHTMLError = MalformedHTMLError;
exports.UnexpectedTagError = UnexpectedTagError;
exports.UnexpectedAttributeError = UnexpectedAttributeError;
exports.UnexpectedAttributeValueError = UnexpectedAttributeValueError;
