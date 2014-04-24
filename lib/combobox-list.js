// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-combobox-list',

  attributeBindings: [
    'role',
    'is-open'
  ],

  role: 'listbox',

  combobox: alias('parentView'),

  'is-open': function() {
    // don't want the attribute at all when closed
    return this.get('combobox.isOpen') ? 'true' : null;
  }.property('combobox.isOpen'),

  registerWithParent: function() {
    this.get('combobox').register('list', this);
  }.on('willInsertElement'),

  createOptions: function() {
    this.set('options', []);
  }.on('init'),

  registerOption: function(option) {
    this.get('options').addObject(option);
  },

  ensureComboboxIsOpen: function() {
    var combobox = this.get('combobox');
    if (!combobox.get('isOpen')) combobox.open()
  },

  focusedOption: null,

  focusNext: function() {
    this.ensureComboboxIsOpen();
    var focusedOption = this.get('focusedOption');
    if (!focusedOption) {
      this.focusOptionAtIndex(0);
    }
  },

  focusPrevious: function() {
    this.ensureComboboxIsOpen();
    console.log('previous!');
  },

  focusOptionAtIndex: function(index) {
    var option = this.get('options')[0];
    this.set('focusedOption', option);
    option.focus();
  }

});

