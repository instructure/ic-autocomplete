// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-combobox-option',

  role: 'option',

  attributeBindings: [
    'role',
    'tabindex'
  ],

  tabindex: -1,

  list: alias('parentView'),

  registerWithList: function() {
    this.get('list').registerOption(this);
  }.on('willInsertElement'),

  focus: function() {
    this.get('element').focus();
  },

  stop: function(event) {
    event.stopPropagation();
  }.on('focusIn'),

  blur: function() {
    // not sure why this is here from ic-menu ...
  }

});

