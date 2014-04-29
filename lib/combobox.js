import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ic-combobox',

  attributeBindings: [
    'is-open',
    'role',
    'aria-expanded'
  ],

  placeholder: null,

  role: 'combobox',

  'aria-expanded': function() {
    return this.get('isOpen')+'';
  }.property('isOpen'),

  'is-open': function() {
    return this.get('isOpen') ? 'true' : null;
  }.property('isOpen'),

  value: null,

  'input-value': null,

  /*
   * Determines whether or not the suggestions are open
   */

  isOpen: false,

  /*
   * Adds the cache to track all {{instructure-suggest-option}}s in the list to
   * facilitate option focus, blur, and navigation.
   */

  init: function() {
    this._super.apply(this, arguments);
    this.set('options', Ember.ArrayProxy.create({content: []}));
  },

  /*
   * Opens the popover.
   */

  open: function() {
    if (this.get('isOpen')) return;
    this.set('isOpen', true);
    var selected = this.get('selected');
    if (selected) {
      // later so the element.focus() call actually happens
      Ember.run.later(selected, 'focus', 0);
    }
  },

  closingWithFocus: false,

  /*
   * Closes the popover.
   */

  close: function() {
    if (!this.get('isOpen')) return;
    this.set('isOpen', false);
    var focusedOption = this.get('focusedOption');
    if (focusedOption) {
      focusedOption.blur();
      this.set('focusedOption', this.get('selected'));
    }
    if (this.get('element').contains(document.activeElement)) {
      this.set('closingWithFocus', true);
      Ember.run.later(this, 'set', 'closingWithFocus', false, 0);
      this.get('input').focus();
    }
  },

  /*
   * Selects the option.
   */

  selectOption: function(option) {
    var selected = this.get('selected');
    if (selected) selected.deselect();
    this.set('selected', option);
    this.set('inputValueBuffer', this.get('selected.label'));
    option.select();
    this.focusOption(option);
    this.get('input').focus();
    this.close();
  },

  setValue: function() {
    this.set('value', this.get('selected.value'));
  }.observes('selected'),

  /*
   * Adds an option to the options cache.
   */

  registerOption: function(option) {
    this.get('options').pushObject(option);
  },

  /*
   * Removes an option from the options cache.
   */

  removeOption: function(optionComponent) {
    if (this.get('focusedOption') === optionComponent) {
      this.set('focusedOption', null);
    }
    this.get('options').removeObject(optionComponent);
  },

  /*
   * Opens the popover on focus
   */

  focusIn: function() {
    if (this.get('closingWithFocus')) {
      return;
    }
    this.open();
  },

  focusOut: function() {
    Ember.run.later(this, function() {
      if (!this.get('element').contains(document.activeElement)) {
        this.close();
      }
    }, 0);
  },

  keydownMap: {
    27/*esc*/:   'close',
    32/*space*/: 'maybeSelectFocusedOption',
    13/*enter*/: 'maybeSelectFocusedOption',
    40/*down*/:  'focusNext',
    38/*up*/:    'focusPrevious'
  },

  /*
   * Navigates the options with the keyboard.
   */
 
  handleKeydown: function(event) {
    var map = this.get('keydownMap');
    var method = map[event.keyCode];
    if (this[method]) {
      event.preventDefault();
      return this[method](event);
    }
    var input = this.get('input');
    if (event.shiftKey) {
      // probably more than just shift here ...
      return;
    }
    if (document.activeElement !== input) {
      if (event.keyCode == 8/*backspace*/) {
        // don't want to wipe it all out
        input.focus();
      } else {
        input.select();
      }
    }
  }.on('keyDown'),

  /*
   * Updates `input-value` to `inputValueBuffer`s value if the popover is open.
   *
   * Because we want `input-value` to be potentially bound to a parent
   * controller's property but not necessarily bound to the input text, we
   * buffer the binding with an intermediate property `inputValueBuffer`.
   * Perhaps a use-case will best illustrate this requirement.
   *
   * Lets say when you type in the input you want to filter the options in the
   * popover. After making a selection and reopening the popover to select a
   * different option the list will only match the currently selected option,
   * but we want to display them all. With an intermediate property
   * `inputValueBuffer`, we can set that and clear `input-value` when we reopen,
   * allowing the list to be redrawn with all available options.
   */

  bindInputValueToBuffer: function() {
    if (!this.get('isOpen')) return;
    this.set('input-value', this.get('inputValueBuffer'));
  }.observes('inputValueBuffer'),

  /*
   * Clears the input value so that any bound properties can make updates to
   * the list of options without changing the value of the input.
   */

  clearInputValue: function() {
    if (!this.get('isOpen')) this.set('input-value', '');
  }.observes('isOpen'),

  /*
   * When a user starts typing after making a selection we may need to
   * open the popover or clear the selection.
   */

  onTypingAgain: function() {
    if (!this.get('isOpen')) {
      // have to manually set here since it didn't set in
      // bindInputValueToBuffer because it wasn't open yet
      this.set('input-value', this.get('inputValueBuffer'));
      this.open();
    }
    if (this.get('selected.label') !== this.get('inputValueBuffer')) {
      this.set('selected', null);
    }
  }.observes('inputValueBuffer'),

  /*
   * Focuses the next option in the popover.
   */

  focusNext: function() {
    var index = 0;
    var focusedOption = this.get('focusedOption');
    if (focusedOption) {
      index = this.get('options').indexOf(focusedOption);
      if (this.get('isOpen')) {
        index = index + 1;
      }
    }
    this.focusOptionAtIndex(index);
  },

  /*
   * Focuses hte previous option in the popover.
   */

  focusPrevious: function() {
    var focusedOption = this.get('focusedOption');
    if (!focusedOption) return;
    var index = this.get('options').indexOf(focusedOption);
    if (this.get('isOpen')) {
      index = index - 1;
    }
    this.focusOptionAtIndex(index);
  },

  /*
   * Focuses an option given an index in the options cache.
   */

  focusOptionAtIndex: function(index) {
    this.open();
    var option = this.get('options').objectAt(index);
    if (!option) return;
    this.focusOption(option);
  },

  /*
   * Focuses an option.
   */

  focusOption: function(option) {
    var focusedOption = this.get('focusedOption');
    if (focusedOption) focusedOption.blur();
    this.set('focusedOption', option);
    option.focus();
  },

  /*
   * Selects the focused item if there is one.
   */

  maybeSelectFocusedOption: function() {
    var focused = this.get('focusedOption');
    if (focused) this.selectOption(focused);
  },

  /*
   * Returns the native <input>
   */

  registerInput: function() {
    this.set('input', this.$('input')[0]);
  }.on('didInsertElement'),

  click: Ember.aliasMethod('open')


});

