// http://www.w3.org/TR/wai-aria-practices/#combobox

import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ic-combobox-toggle',

  attributeBindings: [
    'role',
    'tabindex'
  ],

  role: 'button',

  // the list opens it, keep it out of the tab order
  tabindex: -1

});

