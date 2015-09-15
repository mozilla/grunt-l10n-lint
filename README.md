# grunt-l10n-lint

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
  * Unnamed tags (e.g. `<>`)
  * Unclosed tags (e.g., `<span>This span is not closed`)
  * Mismatched &lt; or &gt; (e.g., `<span`)
  * Tags closed in the wrong order.
    * (e.g., `<a><span>closed out of order</a></span>`)
1. Unexpected tags
  * If the source `.pot` files contain only `a` and `span` tags, the translated
      ,files must:
      1. only contain `a` and `span` elements.
      1. All other elements cause an error.
1. Unexpected tag attributes
  * If the source `.pot` files contain `<a href="/signin" target="_blank">`,
      `<button id="logout">`, and `<div>...`, the translated files must:
      1. `a` elements can have 0, 1 or both `href` and `target` attributes.
      1. `button` elements can 0 or 1 `id` attribute.
      1. All other attributes on any element will cause an error.
1. Unexpected tag attribute values
  * If the source `.pot` files contain `<a href="/signin" target="_blank">`
      and `<button id="logout">`, and `<div>...`, the translated files must:
      1. `a` elements can have one or both `href="/signin""` or
         `targe="_blank"`.
      1. `button` elements can have `id="logout"`
      1. `div` elements can have no attributes.
      1. Any other attributes or attribute values cause an error.

The target translation checks are very coarse.

For example, if the source `.pot` file contains a single `a` element,
_any_ translated string can contain an `a` element.

In addition, if the source `.pot` file contains two `a` elements, one
with `id="first-anchor"` and another with `id="second-anchor"`, any translated
string could contain an `a` element with either `id`.

All translated strings are assumed to be fully formed, independent items, and
are checked individually. Quotes that surround attribute values are not
checked, as long as the tag correctly closes and the attribute value matches
an expected value, the value is accepted.

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



