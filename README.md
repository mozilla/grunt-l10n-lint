# grunt-l10n-lint

[![Build
Status](https://travis-ci.org/mozilla/grunt-l10n-lint.svg?branch=master)](https://travis-ci.org/mozilla/grunt-l10n-lint)

grunt-l10n-lint is a grunt task to check l10n `.po` files for
unexpected/malformed HTML.

## Getting Started
This plugin requires Grunt `>0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-l10n-lint --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-l10n-lint');
```

## The "l10n-lint" task

The source files used to extract allowed HTML are defined using
the `untranslated` option.

The target files to be checked are in `files`.

```js
  grunt.initConfig({
    'l10n-lint': {
      test: {
        options: {
          untranslated: ['test/fixtures/templates/**/*.pot']
        },
        files: [{
          src: 'files-to-check/**/*.po'
        }]
      }
    }
  });
```

## The lint process

The grunt task uses one or more `.po` or `.pot` files as the source
templates from which to extract allowed HTML. The source files are
to create a list of elements, attributes, and attribute values.

The grunt task then parses one or more translated `.po` files for strings
that contain HTML that is malformed, contains unexpected tags, attributes,
or attribute values.

The translated strings are checked, one by one, for:

1. Grossly malformed HTML
  * Unnamed tags (e.g. `<>`, `</>`)
  * Unclosed tags, mismatched `<` or `>` (e.g., `<span`, `span>`)
  * Unclosed elements (e.g., `<span>This span is not closed`)
  * Elements closed in the wrong order.
    * (e.g., `<a><span>closed out of order</a></span>`)
1. Unexpected tags. Tag names that are not used in the source `.pot` files may not be present in the translated `.po` files. For instance:
  * If the source `.pot` files contain only `a` and `span` tags, the translated files:
      1. Can contain 0 or more `a` and `span` tags.
      1. All other tags cause an error.
1. Unexpected attributes. Attributes that are not used on a type of element in the source `.pot` files may not be present on instances of that element type in the translated `.po` files. For instance:
  * If the source `.pot` files contain `<a href="..." target="...">`,
      `<button id="...">` and `<button class="...">`, the translated files:
      1. Can have either, both or neither of the `href` and `target` attributes on each `a` element.
      1. Can have either, both or neither of the `id` and `class` attributes on each `button` element.
      1. All other attributes will cause an error.
1. Unexpected attribute values. Attribute values that are not used on a type of element in the source `.pot` files may not be present on instances of that element type in the translated `.po` files. For instance:
  * If the source `.pot` files contain `<a href="/signin" target="_blank">`
      and `<button id="logout">`, the translated files:
      1. Can only have the value `/signin` for `href` attributes.
      1. Can only have the value `_blank` for `target` attributes.
      1. Can only have the value `logout` for `id` attributes.
      1. All other attribute values cause an error.

The target translation checks are very coarse.

For example, if the source `.pot` file contains a single `a` element,
_any_ translated string can contain an `a` element.

If the source `.pot` file contains two `a` elements, one
with `id="first-anchor"` and another with `id="second-anchor"`, _any_ translated
string could contain an `a` element with either `id`.

All translated strings are assumed to be independent items, and are checked
individually. Quotes that surround attribute values are not checked, as long
as the tag correctly closes and the attribute value matches an expected value,
the value is accepted.

## Running the tests

```bash
npm test
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Get involved:

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License:
This software is available under version 2.0 of the MPL:

  https://www.mozilla.org/MPL/
