import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  /**
   * Using a className since we can't extend HTMLInputElement :(
   */

  classNames: 'ic-autocomplete-input',

  attributeBindings: [
    'aria-activedescendant',
    'aria-autocomplete',
    'aria-owns',
    'role'
  ],

  /**
   * Tells screenreaders how to deal with this element.
   * http://www.w3.org/TR/wai-aria-practices/#combobox
   * http://www.w3.org/TR/wai-aria/roles#combobox
   *
   * @property role
   * @private
   */

  role: 'combobox',

  /**
   * Tells screenreaders that the element uses a list as well as inline auto
   * completion (updates text field, selects autocompleted portion).
   *
   * @property aria-autocomplete
   * @private
   */

  'aria-autocomplete': 'both',


  /**
   * Convenience reference to the autocomplete component.
   *
   * @property autocomplete
   * @private
   */

  autocomplete: alias('parentView'),

  /**
   * Tells the screenreader the list that this input owns.
   *
   * @property aria-owns
   * @private
   */

  'aria-owns': alias('parentView.list.elementId'),

  /**
   * Tells the screenreader which element is active in the list.
   *
   * @property aria-activedescendant
   * @private
   */

  'aria-activedescendant': alias('parentView.selected.elementId'),

  /**
   * When focus is moved from the list to the input, close the list.
   *
   * @method closeOnFocus
   * @private
   */

  closeOnFocus: function() {
    var autocomplete = this.get('autocomplete');
    if (autocomplete.get('ignoreInputFocus')) {
      return;
    }
    autocomplete.close();
  }.on('focusIn')

});

