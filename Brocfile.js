var makeModules = require('broccoli-dist-es6-module');
var templateFilter = require('broccoli-template-compiler');

var templates = templateFilter('lib', {module: true});
module.exports = makeModules(templates, {
  global: 'ic.autocomplete',
  packageName: 'ic-autocomplete',
  main: 'main',
  shim: {
    'ember': 'Ember'
  }
});

