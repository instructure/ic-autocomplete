import Ember from 'ember';

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

  /*
   * Registers itself with the suggest component.
   */

  didInsertElement: function() {
    var parentView = this.get('parentView');
    parentView.registerOption(this);
    if (parentView.get('value') === this.get('value')) {
      parentView.selectOption(this, {focus: false});
    }
  },

  /*
   * Unregisters itself with the suggest component.
   */

  willDestroyElement: function() {
    this.get('parentView').removeOption(this);
  },

  /*
   * Selects this option on click.
   */

  click: function(event) {
    event.stopPropagation();
    this.get('parentView').selectOption(this);
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
    this.get('parentView').focusOption(this);
  },

  deselect: function() {
    this.set('isSelected', false);
  },

  select: function() {
    this.set('isSelected', true);
  }

});

