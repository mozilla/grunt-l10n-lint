/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Generate the expected attributes and their values from the original .pot
 * files. Then compare the attributes and attribute values in the .po files
 * against the originals.
 */

const generateTagData = require('../lib/generate-tag-data');
const extractTranslated = require('../lib/extract-translated');
const extractUntranslated = require('../lib/extract-untranslated');

const CheckTranslation = require('../lib/check-translation');
const checkTranslation = CheckTranslation.checkTranslation;

const MalformedHTMLError = CheckTranslation.MalformedHTMLError;
const UnexpectedTagError = CheckTranslation.UnexpectedTagError;
const UnexpectedAttributeError = CheckTranslation.UnexpectedAttributeError;
const UnexpectedAttributeValueError =
  CheckTranslation.UnexpectedAttributeValueError;

function getUntranslatedStrings(grunt, untranslatedFiles) {
  return untranslatedFiles.reduce(function(accumulator, file) {
    var contents = grunt.file.read(file);
    var fileStrings = extractUntranslated(contents);

    return accumulator.concat(fileStrings);
  }, []);
}

function flattenSourceList(grunt, files) {
  return files.reduce(function(accumulator, line) {
    return accumulator.concat(line.src);
  }, []);
}

function getTranslations(grunt, translatedFiles) {
  return translatedFiles.map(function(src) {
    var contents = grunt.file.read(src);
    var translatedStrings = extractTranslated(contents);

    return {
      src: src,
      translations: translatedStrings,
    };
  });
}

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('l10n-lint', 'Lint your translations', function() {
    var options = this.options({
      untranslated: [],
    });

    /**
     * The sequence:
     * 1. Create a list of expected tags, attributes, and attribute values from
     * the untranslated files.
     * 2. Create a list of all translated files to be checked.
     * 3. Check each translation in the list of translated files against the
     *    list of expected tags, attributes, and attribute values. If there are
     *    any discrepencies, log an error.
     */
    var untranslatedFiles = grunt.file.expand(options.untranslated);
    var untranslatedStrings = getUntranslatedStrings(grunt, untranslatedFiles);

    var tagData = generateTagData(untranslatedStrings);

    grunt.log.debug('tagData', JSON.stringify(tagData, null, 2));

    var translatedFiles = flattenSourceList(grunt, this.files);
    var translations = getTranslations(grunt, translatedFiles);

    translations.forEach(function(translation) {
      var translatedStrings = translation.translations;
      var src = translation.src;

      translatedStrings.forEach(function(translation) {
        grunt.log.debug(translation);

        checkTranslation(translation, tagData, function(err) {
          if (!err) {
            return;
          }

          grunt.log.debug('Error:\n', JSON.stringify(err, null, 2));

          if (err instanceof MalformedHTMLError) {
            grunt.log.error('MALFORMED HTML (%s): %s', src, translation);
          } else if (err instanceof UnexpectedTagError) {
            grunt.log.error(
              'UNEXPECTED TAG (%s): %s [%s]',
              src,
              err.tagName,
              translation
            );
          } else if (err instanceof UnexpectedAttributeError) {
            grunt.log.error(
              'UNEXPECTED ATTRIBUTE (%s): %s [%s]',
              src,
              err.attributeName,
              translation
            );
          } else if (err instanceof UnexpectedAttributeValueError) {
            grunt.log.error(
              'UNEXPECTED ATTRIBUTE VALUE: (%s): %s=%s [%s]',
              src,
              err.attributeName,
              err.attributeValue,
              translation
            );
          }
        });
      });
    });

    var fileCount = translations.length;

    if (this.errorCount !== 0) {
      grunt.fail.warn(
        'Found ' +
          this.errorCount +
          ' ' +
          grunt.util.pluralize(this.errorCount, 'error/errors') +
          ' in ' +
          fileCount +
          ' files'
      );
    } else {
      grunt.log.writeln(
        'Checked ' +
          fileCount +
          ' ' +
          grunt.util.pluralize(fileCount, 'file/files') +
          ' for invalid translations'
      );
    }
  });
};
