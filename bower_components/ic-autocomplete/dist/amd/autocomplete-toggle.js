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

      /**
       * Because the toggle shouldn't be tabbable, there's no reason to give it any
       * roles or even be visible to screen readers. The specs say it should have
       * roles and a label, etc. but if its never reachable, why?
       *
       * @property aria-hidden
       * @private
       */

      'aria-hidden': 'true',

      /**
       * We don't want the toggle to be tabbable. Keyboard users can open the
       * menu with arrow keys or typing.
       *
       * @property tabindex
       * @private
       */

      tabindex: -1,

      /**
       * @property openListOnClick
       * @private
       */

      openListOnClick: function(event) {
        this.get('parentView').toggleVisibility();
      }.on('click')

    });
  });