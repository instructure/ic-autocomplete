import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ic-autocomplete-toggle',

  attributeBindings: [
    'tabindex',
    'aria-hidden'
  ],

  'aria-hidden': 'true',

  tabindex: -1,

  click: function(event) {
    this.get('parentView').toggleVisibility();
  }

});

