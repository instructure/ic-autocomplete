define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    var alias = Ember.computed.alias;

    __exports__["default"] = Ember.Component.extend({

      tagName: 'ic-autocomplete-list',

      attributeBindings: [
        'role',
        'aria-expanded'
      ],

      /**
       * Tells the screenreader how to deal with this element.
       * http://www.w3.org/TR/wai-aria/roles#listbox
       *
       * @property role
       * @private
       */

      role: 'listbox',

      /**
       * Tells the screenreader when this element is expanded or not.
       *
       * @property aria-expanded
       * @private
       */

      'aria-expanded': function() {
        return this.get('parentView.isOpen')+'';
      }.property('parentView.isOpen'),

      /**
       * @method registerWithParent
       * @private
       */

      registerWithParent: function() {
        this.get('parentView').registerList(this);
      }.on('didInsertElement')

    });
  });