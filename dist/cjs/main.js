"use strict";
var Application = require("ember").Application;
var autocompleteCss = require("./templates/autocomplete-css")["default"] || require("./templates/autocomplete-css");
var autocompleteTemplate = require("./templates/autocomplete")["default"] || require("./templates/autocomplete");
var AutocompleteComponent = require("./autocomplete")["default"] || require("./autocomplete");
var AutocompleteOptionComponent = require("./autocomplete-option")["default"] || require("./autocomplete-option");
var AutocompleteToggleComponent = require("./autocomplete-toggle")["default"] || require("./autocomplete-toggle");
var AutocompleteInputComponent = require("./autocomplete-input")["default"] || require("./autocomplete-input");
var AutocompleteListComponent = require("./autocomplete-list")["default"] || require("./autocomplete-list");

Application.initializer({
  name: 'ic-autocomplete',
  initialize: function(container) {
    container.register('template:components/ic-autocomplete', autocompleteTemplate);
    container.register('template:components/ic-autocomplete-css', autocompleteCss);
    container.register('component:ic-autocomplete', AutocompleteComponent);
    container.register('component:ic-autocomplete-option', AutocompleteOptionComponent);
    container.register('component:ic-autocomplete-toggle', AutocompleteToggleComponent);
    container.register('component:ic-autocomplete-input', AutocompleteInputComponent);
    container.register('component:ic-autocomplete-list', AutocompleteListComponent);
  }
});

exports.autocompleteCss = autocompleteCss;
exports.autocompleteTemplate = autocompleteTemplate;
exports.AutocompleteComponent = AutocompleteComponent;
exports.AutocompleteOptionComponent = AutocompleteOptionComponent;
exports.AutocompleteToggleComponent = AutocompleteToggleComponent;
exports.AutocompleteInputComponent = AutocompleteInputComponent;
exports.AutocompleteListComponent = AutocompleteListComponent;