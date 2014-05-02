import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-autocomplete-option',

  attributeBindings: [
    'aria-label',
    'tabindex',
    'selected',
    'role'
  ],

  role: 'option',

  tabindex: -1,

  selected: function() {
    return this.get('isSelected') ? 'true' : null;
  }.property('isSelected'),

  focused: false,

  autocomplete: alias('parentView.parentView'),

  /*
   * Registers itself with the suggest component.
   */

  didInsertElement: function() {
    this.get('autocomplete').registerOption(this);
  },

  /*
   * Unregisters itself with the suggest component.
   */

  willDestroyElement: function() {
    this.get('autocomplete').removeOption(this);
  },

  /*
   * Selects this option on click.
   */

  click: function(event) {
    event.stopPropagation();
    this.get('autocomplete').selectOption(this);
  },

  /*
   * Focuses this option.
   */

  focus: function(options) {
    options = options || {};
    this.set('focused', true);
    if (options.focusElement !== false) {
      this.get('element').focus();
    }
  },

  /*
   * Blurs this option
   */

  blur: function() {
    this.set('focused', false);
  },

  /*
   * Focuses on mouseenter.
   */

  mouseEnter: function() {
    // TODO: this makes mousing around a list with overflow kinda weird.
    this.get('autocomplete').focusOption(this);
  },

  deselect: function() {
    this.set('isSelected', false);
  },

  select: function() {
    this.set('isSelected', true);
  }

});

