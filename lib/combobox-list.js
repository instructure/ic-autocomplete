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

  // TODO: ic-menu, ic-tabs, and this all have pretty much identical list
  // management going on, would love to abstract

  focusedOption: null,

  focusNext: function(event) {
    event.preventDefault();
    this.ensureComboboxIsOpen();
    var index = 0;
    var options = this.get('options');
    var focusedOption = this.get('focusedOption');
    if (focusedOption) {
      index = options.indexOf(focusedOption) + 1;
    }
    if (index === options.length) {
      index = 0; // loop it
    }
    this.focusOptionAtIndex(index);
  },

  focusPrevious: function() {
    event.preventDefault();
    this.ensureComboboxIsOpen();
    var options = this.get('options');
    var index = options.get('length') - 1;
    var focusedOption = this.get('focusedOption');
    if (focusedOption) {
      index = options.indexOf(focusedOption) - 1;
    }
    if (index == -1) {
      index = options.length - 1; // loop it
    }
    this.focusOptionAtIndex(index);
  },

  focusOptionAtIndex: function(index) {
    var option = this.get('options').objectAt(index);
    this.focusOption(option);
  },

  focusOption: function(option) {
    var focusedOption = this.get('focusedOption');
    if (focusedOption) focusedOption.blur();
    this.set('focusedOption', option);
    option.focus();
  }

});

