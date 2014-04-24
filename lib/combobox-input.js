import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: ['ic-combobox-input'],

  combobox: alias('parentView'),

  register: function() {
    this.get('parentView').register('input', this);
  }.on('willInsertElement'),

  openList: function() {
    this.get('combobox').open();
  }.on('focusIn'),

  closeList: function() {
    this.get('combobox').close();
  }.on('focusOut')

});

