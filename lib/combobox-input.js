import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: 'ic-combobox-input',

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
  },

  focusOut: function() {
    // later for document.activeElement to be correct
    Ember.run.later(this, function() {
      if (!this.get('combobox.element').contains(document.activeElement)) {
        this.get('combobox').close();
      }
    }, 0);
  }

});

