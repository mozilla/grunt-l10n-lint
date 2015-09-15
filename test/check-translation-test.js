/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


const grunt = require('grunt');

const CheckTranslation = require('../lib/check-translation');
const checkTranslation = CheckTranslation.checkTranslation;

const MalformedHTMLError = CheckTranslation.MalformedHTMLError;
const UnexpectedTagError = CheckTranslation.UnexpectedTagError;
const UnexpectedAttributeError = CheckTranslation.UnexpectedAttributeError;
const UnexpectedAttributeValueError = CheckTranslation.UnexpectedAttributeValueError;

var expectedTagData;

exports.check_translations = {
  setUp: function (done) {
    expectedTagData =
          grunt.file.readJSON('test/expected/client-pot-tag-data.json');

    done();
  },

  'valid attribute value on tag that expects attribute - anchor': function (test) {
    checkTranslation(
      '<a href="https://www.gravatar.com">this is valid</a>',
      expectedTagData,
      function (err) {
        test.equal(err, null);
        test.done();
      }
    );
  },

  'valid attribute value on tag that expects attribute - span': function (test) {
    checkTranslation(
      '<span tabindex="1">this is also valid</span>',
      expectedTagData,
      function (err) {
        test.equal(err, null);
        test.done();
      }
    );
  },

  'multiple valid anchors href': function (test) {
    checkTranslation(
      '<a href="/signup">Sign up</a> or <a href="/signin">Sign in</a>',
      expectedTagData,
      function (err) {
        test.equal(err, null);
        test.done();
      }
    );
  },

  'nested valid tags': function (test) {
    checkTranslation(
      '<span><a href="/signin">Signin</a></span>',
      expectedTagData,
      function (err) {
        test.equal(err, null);
        test.done();
      }
    );
  },

  'unexpected tag': function (test) {
    checkTranslation(
      '<img>No img expected</img>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof UnexpectedTagError);
        test.done();
      }
    );
  },

  'unexpected attribute on tag': function (test) {
    checkTranslation(
      '<span id="service">no id on span expected</a>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof UnexpectedAttributeError);
        test.done();
      }
    );
  },

  'unexpected attribute value': function (test) {
    checkTranslation(
      '<a href="signup">href should have leading /</a>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof UnexpectedAttributeValueError);
        test.done();
      }
    );
  },

  'malformed html - no closing tag': function (test) {
    checkTranslation(
      '<a>Where is the closing tag',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - mismatched closing tag': function (test) {
    checkTranslation(
      '<a>mismatched closing tag</span>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - no opening tag': function (test) {
    checkTranslation(
      'no opening tag</span>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - no closing bracket on closing tag': function (test) {
    checkTranslation(
      '<a> no closing bracket on closing tag</a',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - no opening tag name': function (test) {
    checkTranslation(
      '<>no opening tag name</a>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - no opening or closing tag name': function (test) {
    checkTranslation(
      '<>no opening tag name</>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - no closing tag name': function (test) {
    checkTranslation(
      '<a>no closing tag name</>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - unmatched opening bracket': function (test) {
    checkTranslation(
      '<',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - unmatched opening bracket of closing tag': function (test) {
    checkTranslation(
      '</',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - unmatched closing bracket': function (test) {
    checkTranslation(
      '>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - unmatched closing braket of close tag': function (test) {
    checkTranslation(
      '/>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },

  'malformed html - nested tags closed out of order': function (test) {
    checkTranslation(
      '<span><a href="/signin">Signin</span></a>',
      expectedTagData,
      function (err) {
        test.ok(err instanceof MalformedHTMLError);
        test.done();
      }
    );
  },


};

