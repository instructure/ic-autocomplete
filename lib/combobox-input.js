import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: ['ic-combobox-input'],

  combobox: alias('parentView'),

  list: alias('parentView.list'),

  register: function() {
    this.get('parentView').register('input', this);
  }.on('willInsertElement'),

  focus: function() {
    this.get('element').focus();
  },

  setValueToFocusedOption: function() {
    var label = this.get('list.focusedOption.label');
    // doesn't work *the first time* if we don't do it later, WHY BACKBURNER, WHY?
    Ember.run.scheduleOnce('afterRender', this, 'set', 'value', label);
  }.observes('list.focusedOption.label'),

  openOnClick: function() {
    this.get('combobox').open();
  }.on('click')

});

