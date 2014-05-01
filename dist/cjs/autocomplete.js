"use strict";
var Ember = require("ember")["default"] || require("ember");

exports["default"] = Ember.Component.extend({

  tagName: 'ic-autocomplete',

  attributeBindings: [
    'is-open',
    'aria-expanded'
  ],

  placeholder: null,

  'is-open': function() {
    return this.get('isOpen') ? 'true' : null;
  }.property('isOpen'),

  value: null,

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
  },

  preventFocusInHandler: false,

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
      this.set('preventFocusInHandler', true);
      Ember.run.later(this, 'set', 'preventFocusInHandler', false, 0);
      this.get('input').focus();
    }
  },

  /*
   * Selects the option.
   */

  selectOption: function(option, options) {
    options = options || {};
    var selected = this.get('selected');
    if (selected) selected.deselect();
    this.set('selected', option);
    this.set('inputValueBuffer', this.get('selected.label'));
    option.select();
    // TODO: might be able to check some state instead of using these options
    this.focusOption(option, {focusElement: options.focusOption});
    if (options.focus !== false) this.get('input').focus();
    if (options.close !== false) {
      this.close();
    }
    this.sendAction('on-select', this, option);
  },

  // handle case where apps reset the list on select, you get new options
  // all registering and therefore an infinite loop of selecting the option
  // whose value matches the current value
  // TODO: DRY up with selectOption (maybe?)
  selectOptionWithoutPotentialRecursion: function(option) {
    this.set('selected', option);
    option.select();
    this.focusOption(option, {focus: false});
  },

  setValue: function() {
    this.set('value', this.get('selected.value'));
  }.observes('selected'),

  /*
   * Adds an option to the options cache.
   */

  registerOption: function(option) {
    this.get('options').pushObject(option);
    if (this.get('value') === option.get('value')) {
      if (this.get('selected')) {
        this.selectOptionWithoutPotentialRecursion(option);
      } else {
        this.selectOption(option, {focus: false});
      }
    }

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

  startBackspacing: function() {
    // prevents autocomplete from not happening on backspacing an empty input
    if (this.get('inputValueBuffer') === '') {
      return;
    }
    this.set('isBackspacing', true);
  },

  keydownMap: {
    27/*esc*/:   'close',
    32/*space*/: 'maybeSelectFocusedOption',
    13/*enter*/: 'maybeSelectFocusedOptionOnEnter',
    40/*down*/:  'focusNext',
    38/*up*/:    'focusPrevious',
    8/*backspace*/: 'startBackspacing'
  },

  /*
   * Navigates the options with the keyboard.
   */
 
  handleKeydown: function(event) {
    var map = this.get('keydownMap');
    var method = map[event.keyCode];
    if (this[method]) {
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

  autocompleteText: function() {
    if (!this.get('isOpen') || !this.get('options.length')) {
      return;
    }
    if (this.get('isBackspacing')) {
      this.set('lastAutocompleteValues', null);
      this.set('isBackspacing', false);
      return;
    }
    var first = this.get('options').objectAt(0);
    var label = first.get('label');
    var input = this.get('inputValueBuffer');
    if (input === '') {
      return;
    }
    var fragment = label.substring(input.length);
    var autocompleteValues = label+':'+input;
    if (autocompleteValues == this.get('lastAutocompleteValues')) {
      return;
    }
    this.set('lastAutocompleteValues', autocompleteValues);
    this.set('ignoreInputValueBuffer', true);
    var el = this.get('input');
    el.value = label;
    el.setSelectionRange(input.length, label.length);
    this.selectOption(first, {close: false, focusOption: false});
  },

  /*
   * When a user starts typing after making a selection we may need to
   * open the popover or clear the selection.
   */

  onInput: function() {
    if (!this.get('isOpen')) {
      this.open();
    }
    if (this.get('ignoreInputValueBuffer')) {
      this.set('ignoreInputValueBuffer', false);
      return;
    }
    if (this.get('selected.label') !== this.get('inputValueBuffer')) {
      this.set('selected', null);
    }
    if (this.get('selected')) {
      return;
    }
    this.sendAction('on-input', this, this.get('input.value'));
    Ember.run.scheduleOnce('afterRender', this, 'autocompleteText');
  }.observes('inputValueBuffer'),

  /*
   * Focuses the next option in the popover.
   */

  focusNext: function(event) {
    event.preventDefault();
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

  focusPrevious: function(event) {
    event.preventDefault();
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
    var options = this.get('options');
    if (index === -1) {
      index = options.get('length') - 1;
    } else if (index === options.get('length')) {
      index = 0;
    }
    var option = this.get('options').objectAt(index);
    if (!option) return;
    this.focusOption(option);
  },

  /*
   * Focuses an option.
   */

  focusOption: function(option, options) {
    options = options || {};
    var focusedOption = this.get('focusedOption');
    if (focusedOption) focusedOption.blur();
    this.set('focusedOption', option);
    if (options.focus !== false) {
      if (this.get('isOpen')) {
        option.focus(options);
      } else {
        this.open();
        // can't focus an option until its open
        Ember.run.scheduleOnce('afterRender', option, 'focus', options);
      }
    }
  },

  /*
   * Selects the focused item if there is one.
   */

  maybeSelectFocusedOption: function(event) {
    event.preventDefault();
    var focused = this.get('focusedOption');
    if (focused) this.selectOption(focused);
  },

  maybeSelectFocusedOptionOnEnter: function(event) {
    this.maybeSelectFocusedOption(event);
    this.get('input').select();
  },



  /*
   * Returns the native <input>
   */

  registerInput: function() {
    this.set('input', this.$('input')[0]);
  }.on('didInsertElement'),

  toggleVisibility: function() {
    if (this.get('isOpen')) {
      this.set('preventFocusInHandler', true);
      Ember.run.later(this, 'set', 'preventFocusInHandler', false, 0);
      this.close();
    } else {
      this.open();
    }
  },

  // focusOut for options and input here
  focusOut: function() {
    // later for document.activeElement to be correct
    Ember.run.later(this, function() {
      if (!this.get('element').contains(document.activeElement)) {
        this.close();
      }
    }, 0);
  },

  bindValue: function() {
    var selected = this.get('selected');
    var value = this.get('value');
    if (!selected && (value == null || value === '')) {
      return;
    }
    if (value === selected.get('value')) {
      return;
    }
    // This might get slow ...
    this.get('options').forEach(function(option) {
      if (option.get('value') === value) {
        this.selectOption(option);
      }
    }, this);
  }.observes('value')

});