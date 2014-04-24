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

  combobox: alias('parentView.parentView'),

  _label: null,

  label: function(key, val) {
    if (arguments.length > 1) {
      this.set('_label', val);
    }
    var label = this.get('_label');
    return label || this.$().text().trim();
  }.property(),

  registerWithList: function() {
    this.get('list').registerOption(this);
  }.on('willInsertElement'),

  focus: function() {
    this.get('element').focus();
  },

  stopProp: function(event) {
    event.stopPropagation();
  }.on('focusIn'),

  focusOnClick: function(event) {
    this.get('list').focusOption(this);
    this.get('combobox').closeWithFocus(event);
  }.on('click'),

  setComboboxValue: function() {
    if (this.get('list.focusedOption') === this) {
      return;
    }
    if (this.get('combobox.value') === this.get('value')) {
      this.get('list').focusOption(this);
    }
  }.observes('combobox.value').on('didInsertElement'),

  blur: function() {
    // not sure why this is here from ic-menu ...
  }

});

