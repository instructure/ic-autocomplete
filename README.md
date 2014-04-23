ic-autocomplete
===============

[![Build Status](https://travis-ci.org/instructure/ic-autocomplete.png?branch=master)](https://travis-ci.org/instructure/ic-autocomplete)

[WAI-ARIA][wai-aria] accessible autocomplete dialog component for [Ember.js][ember].

Demo
----

http://instructure.github.io/ic-autocomplete

Installation
------------

```sh
$ npm install ic-autocomplete
```

or ...

```sh
$ bower install ic-autocomplete
```

or just grab your preferred distribution from `dist/`.

Then include the script(s) into your application:

### npm+browserify

`require('ic-autocomplete')`

### amd

Register `ic-autocomplete` as a [package][rjspackage], then:

`define(['ic-autocomplete'], ...)`

### named-amd

You ought to know what you're doing if this is the case.

### globals

`<script src="bower_components/ic-styled/main.js"></script>`
`<script src="bower_components/ic-autocomplete/dist/globals/main.js"></script>`

{{ic-autocomplete}} Usage
------------------

Contributing
------------

```sh
$ git clone <this repo>
$ npm install
$ npm test
# during dev
$ broccoli serve
# localhost:4200/globals/main.js instead of dist/globals/main.js
# new tab
$ karma start
```

Make a new branch, send a pull request, squashing commits into one
change is preferred.

  [rjspackage]:http://requirejs.org/docs/api.html#packages
  [ember]:http://emberjs.com
  [wai-aria]:http://www.w3.org/TR/wai-aria/roles#combobox

