import Ember from 'ember';

var alias = Ember.computed.alias;

export default Ember.TextField.extend({

  classNames: 'ic-autocomplete-input',

  attributeBindings: [
    'aria-autocomplete',
    'aria-owns',
    'aria-activedescendant',
    'role'
  ],

  /**
   * Tells screenreaders how to deal with this element
   *
   * @property role
   * @private
   */

  role: 'combobox',

  /**
   * Tells screenreaders that the element uses a list as well as inline auto
   * completion.
   *
   * @property aria-autocomplete
   * @private
   */

  'aria-autocomplete': 'both',


  /**
   * Reference to the autocomplete component for convenience.
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
   * Opens or closes
   */

  toggleAutocompleteVisibility: function() {
    if (this.get('autocomplete.preventFocusInHandler')) {
      return;
    }
    if (this.get('autocomplete.open')) {
      this.get('autocomplete').close();
    } else {
      this.get('autocomplete').open();
    }
  }.on('focusIn')

});

