import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: 'ic-combobox-input',

  attributeBindings: [
    'aria-autocomplete'
  ],

  combobox: alias('parentView'),

  open: function() {
    this.get('combobox').open();
  },

  close: function() {
    this.get('combobox').close();
  },

  focusIn: function() {
    if (this.get('combobox.preventFocusInHandler')) {
      return;
    }
    if (this.get('combobox.open')) {
      this.close();
    } else {
      this.open();
    }
  },

  focusOut: function() {
    Ember.run.later(this, function() {
      if (!this.get('combobox.element').contains(document.activeElement)) {
        this.close();
      }
    }, 0);
  }

});

