// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-combobox-option',

  role: 'option',

  attributeBindings: [
    'role',
    'tabindex',
    'is-focused'
  ],

  'is-focused': function() {
    return this.get('isFocused') ? 'true' : null;
  }.property('isFocused'),

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
  }.on('didInsertElement'),

  unregisterWithList: function() {
    this.get('list').unregisterOption(this);
  }.on('willDestroyElement'),

  focus: function() {
    this.set('isFocused', true);
  },

  focusOnClick: function(event) {
    this.get('list').focusOption(this);
    this.get('combobox').closeWithFocus(event);
  }.on('click'),

  blur: function() {
    this.set('isFocused', false);
  },

  //setComboboxValue: function() {
    //if (this.get('list.focusedOption') === this) {
      //return;
    //}
    //if (this.get('combobox.value') === this.get('value')) {
      //this.get('list').focusOption(this);
    //}
  //}.observes('combobox.value').on('didInsertElement'),

});

