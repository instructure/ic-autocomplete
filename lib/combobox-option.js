import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ic-combobox-option',

  classNameBindings: ['selected', 'focused'],

  attributeBindings: ['aria-label', 'tabindex'],

  tabindex: -1,

  selected: false,

  focused: false,

  /*
   * Registers itself with the suggest component.
   */

  didInsertElement: function() {
    var parentView = this.get('parentView');
    parentView.registerOption(this);
    if (parentView.get('value') === this.get('value')) {
      parentView.selectOption(this);
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

  click: function() {
    this.get('parentView').selectOption(this);
  },

  /*
   * Focuses this option.
   */

  focus: function() {
    this.set('focused', true);
    this.get('parentView').set('focusedOption', this);
    this.$().focus();
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
    this.get('parentView').focusOption(this);
  }

});

