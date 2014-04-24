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

  //'aria-labelledby': alias('input.elementId'),

  isOpen: false,

  register: function(type, component) {
    this.set(type, component);
  },

  open: function() {
    this.set('isOpen', true);
    this.focus();
  },

  expandOnFocus: true,

  close: function(options) {
    this.set('isOpen', false);
    if (options && options.focus) {
      this.set('expandOnFocus', false);
      Ember.run.later(this, 'set', 'expandOnFocus', true, 0);
      this.focus();
    }
  },

  focus: function() {
    this.get('input').focus();
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
    if (this[method]) this[method](event);
  }.on('keyDown'),

  closeWithFocus: function(event) {
    event.preventDefault();
    this.close({focus: true});
  },

  focusNext: function(event) {
    this.get('list').focusNext(event);
  },

  focusPrevious: function(event) {
    this.get('list').focusPrevious(event);
  },

  openOnFocusIn: function(event) {
    if (this.get('expandOnFocus') === false) {
      return;
    }
    this.open();
  }.on('focusIn'),

  closeOnFocusOut: function(event) {
    // later so activeElement is correct
    Ember.run.later(this, function() {
      if (this.get('element').contains(document.activeElement)) {
        return;
      }
      this.close();
    }, 0);
  }.on('focusOut')

});

