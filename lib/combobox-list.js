// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-combobox-list',

  attributeBindings: [
    'role',
    'is-open'
  ],

  role: 'listbox',

  combobox: alias('parentView'),

  'is-open': function() {
    // don't want the attribute at all when closed
    return this.get('combobox.isOpen') ? 'true' : null;
  }.property('combobox.isOpen'),

  register: function() {
    this.get('combobox').register('list', this);
  }.on('willInsertElement')

});

