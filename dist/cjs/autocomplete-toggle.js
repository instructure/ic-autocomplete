"use strict";
var Ember = require("ember")["default"] || require("ember");

exports["default"] = Ember.Component.extend({

  tagName: 'ic-autocomplete-toggle',

  attributeBindings: [
    'tabindex',
    'aria-hidden'
  ],

  'aria-hidden': 'true',

  tabindex: -1,

  click: function(event) {
    this.get('parentView').toggleVisibility();
  }

});