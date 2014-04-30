define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({

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
  });