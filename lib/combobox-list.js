// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ic-combobox-list',

  attributeBindings: [
    'role'
  ],

  role: 'listbox'

});

