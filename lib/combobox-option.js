import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ic-combobox-option',

  classNameBindings: [
    'selected',
    'focused'
  ],

  attributeBindings: [
    'tabindex'
  ],

  tabindex: -1,

  selected: false,

  focused: false,

  /*
   * Registers itself with the suggest component.
   */

  registerWithParent: function() {
    var parentView = this.get('parentView');
    parentView.registerOption(this);
    if (parentView.get('value') === this.get('value')) {
      parentView.selectOption(this);
    }
  }.on('didInsertElement'),

  /*
   * Unregisters itself with the suggest component.
   */

  unregisterWithParent: function() {
    this.get('parentView').removeOption(this);
  }.on('willDestroyElement'),

  /*
   * Selects this option on click.
   */

  selectOnClick: function() {
    this.get('parentView').selectOption(this);
  }.on('click'),

  /*
   * Focuses this option.
   */

  focus: function() {
    this.set('focused', true);
    this.get('parentView').set('focusedOption', this);
    this.get('element').focus();
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

  focusOnMouseEnter: function() {
    // why am I doing this?
    this.get('parentView').focusOption(this);
  }.on('mouseEnter')

});


