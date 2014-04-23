ic-combobox
===============

[![Build Status](https://travis-ci.org/instructure/ic-combobox.png?branch=master)](https://travis-ci.org/instructure/ic-combobox)

[WAI-ARIA][wai-aria] accessible combobox dialog component for [Ember.js][ember].

Demo
----

http://instructure.github.io/ic-combobox

Installation
------------

```sh
$ npm install ic-combobox
```

or ...

```sh
$ bower install ic-combobox
```

or just grab your preferred distribution from `dist/`.

Then include the script(s) into your application:

### npm+browserify

`require('ic-combobox')`

### amd

Register `ic-combobox` as a [package][rjspackage], then:

`define(['ic-combobox'], ...)`

### named-amd

You ought to know what you're doing if this is the case.

### globals

`<script src="bower_components/ic-styled/main.js"></script>`
`<script src="bower_components/ic-combobox/dist/globals/main.js"></script>`

{{ic-combobox}} Usage
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

