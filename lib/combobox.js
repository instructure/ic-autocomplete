// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-combobox',

  attributeBindings: [
    'role',
    'aria-expanded',
    'aria-labelledby'
  ],

  role: 'combobox',

  'aria-expanded': function() {
    return this.get('isOpen')+''; // coerce to string true/false
  }.property('isOpen'),

  'aria-labelledby': alias('input.elementId'),

  isOpen: false,

  register: function(type, component) {
    this.set(type, component);
  },

  open: function() {
    this.set('isOpen', true);
    this.focus();
  },

  close: function(options) {
    this.set('isOpen', false);
  },

  focus: function() {
    this.get('input').focus();
  }

});

