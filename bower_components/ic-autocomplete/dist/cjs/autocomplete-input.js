"use strict";
var Ember = require("ember")["default"] || require("ember");

var alias = Ember.computed.alias;

exports["default"] = Ember.TextField.extend({

  classNames: 'ic-autocomplete-input',

  attributeBindings: [
    'aria-autocomplete',
    'aria-expanded',
    'aria-owns',
    'aria-activedescendant',
    'role'
  ],

  role: 'combobox',

  'aria-autocomplete': 'both',

  autocomplete: alias('parentView'),

  'aria-expanded': function() {
    return this.get('autocomplete.isOpen')+'';
  }.property('autocomplete.isOpen'),

  'aria-owns': alias('parentView.elementId'),

  'aria-activedescendant': alias('parentView.selected.elementId'),

  focusIn: function() {
    if (this.get('autocomplete.preventFocusInHandler')) {
      return;
    }
    if (this.get('autocomplete.open')) {
      this.get('autocomplete').close();
    } else {
      this.get('autocomplete').open();
    }
  }

});