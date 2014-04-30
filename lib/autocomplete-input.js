import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: 'ic-autocomplete-input',

  attributeBindings: [
    'aria-autocomplete'
  ],

  combobox: alias('parentView'),

  focusIn: function() {
    if (this.get('combobox.preventFocusInHandler')) {
      return;
    }
    if (this.get('combobox.open')) {
      this.get('combobox').close();
    } else {
      this.get('combobox').open();
    }
  }

});

