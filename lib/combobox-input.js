import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: ['ic-combobox-input'],

  combobox: alias('parentView'),

  list: alias('parentView.list'),

  focusedOption: alias('parentView.list.focusedOption'),

  register: function() {
    this.get('parentView').register('input', this);
  }.on('willInsertElement'),

  focus: function() {
    this.get('element').focus();
  },

  keydownMap: {
    27/*esc*/:   'closeWithFocus',
    32/*space*/: 'closeWithFocus',
    13/*enter*/: 'closeWithFocus',
    40/*down*/:  'focusNext',
    38/*up*/:    'focusPrevious'
  },

  handleKeydown: function(event) {
    var map = this.get('keydownMap');
    var method = map[event.keyCode];
    if (this[method]) {
      event.preventDefault();
      console.log('handleKeydown');
      this[method](event);
    }
  }.on('keyDown'),

  closeWithFocus: function() {
    this.get('combobox').closeWithFocus();
  },

  focusPrevious: function() {
    this.get('list').focusPrevious();
  },

  focusNext: function() {
    this.get('list').focusNext();
  },

  openOnClick: function() {
    this.get('combobox').open();
  }.on('click'),

  openOnFocusIn: function(event) {
    this.get('combobox').open();
  }.on('focusIn'),

  closeOnFocusOut: function(event) {
    this.get('combobox').close();
  }.on('focusOut'),

  clearFocusedInputOnInput: function() {
    var focusedOption = this.get('focusedOption');
    if (!focusedOption) {
      return;
    }
    if (focusedOption.get('label') === this.get('value')) {
      return;
    }
    this.get('list').clearFocusedOption();
  }.observes('value')

});

