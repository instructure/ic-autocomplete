import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: 'ic-autocomplete-input',

  attributeBindings: [
    'aria-autocomplete',
    'aria-owns',
    'aria-activedescendant',
    'role'
  ],

  role: 'combobox',

  'aria-autocomplete': 'both',

  autocomplete: alias('parentView'),

  'aria-owns': alias('parentView.list.elementId'),

  'aria-activedescendant': alias('parentView.selected.elementId'),

  focusIn: function() {
    if (this.get('autocomplete.preventFocusInHandler')) {
      return;
    }
    if (this.get('autocomplete.open')) {
      this.get('autocomplete').close();
    } else {
      this.get('autocomplete').open();
    }
  }

});

