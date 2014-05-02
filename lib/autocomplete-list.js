import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.Component.extend({

  tagName: 'ic-autocomplete-list',

  attributeBindings: [
    'role',
    'aria-expanded'
  ],

  role: 'listbox',

  'aria-expanded': function() {
    return this.get('parentView.isOpen')+'';
  }.property('parentView.isOpen'),

  registerWithParent: function() {
    this.get('parentView').registerList(this);
  }.on('didInsertElement')

});

