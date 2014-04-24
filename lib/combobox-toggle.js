// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-combobox-toggle',

  attributeBindings: [
    'role',
    'tabindex'
  ],

  role: 'button',

  combobox: alias('parentView'),

  isOpen: alias('parentView.isOpen'),

  // keep it out of the tab order
  tabindex: -1,

  toggle: function() {
    var action = this.get('isOpen') ? 'close' : 'open';
    this.get('combobox')[action]();
  }.on('click'),

  // prevents clicks from taking focus and then triggering
  // the open/close of stuff
  cancelStuff: function(event) {
    event.preventDefault();
  }.on('mouseDown')

});

