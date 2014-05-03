!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.ic||(o.ic={})).autocomplete=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var alias = Ember.computed.alias;

exports["default"] = Ember.TextField.extend({

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
},{}],2:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var alias = Ember.computed.alias;

exports["default"] = Ember.Component.extend({

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
},{}],3:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var alias = Ember.computed.alias;

exports["default"] = Ember.Component.extend({

  tagName: 'ic-autocomplete-option',

  attributeBindings: [
    'aria-label',
    'role',
    'selected',
    'tabindex'
  ],

  /**
   * Tells the screenreader how to deal with this element.
   * http://www.w3.org/TR/wai-aria/roles#option
   *
   * @property role
   * @private
   */

  role: 'option',

  /**
   * We do not want the options to be tabbable, but we do want to focus them.
   *
   * @property tabindex
   * @private
   */

  tabindex: -1,

  /**
   * Attribute binding to facilitate CSS on selected options.  Can style with
   * `ic-autocomplete-option[selected] {}`
   *
   * @property selected
   * @private
   */

  selected: function() {
    return this.get('isSelected') ? 'true' : null;
  }.property('isSelected'),

  /**
   * TODO: figure out if we actually need this property, I think its leftover
   * from and earlier implementation
   *
   * @property focused
   * @private
   */

  focused: false,


  /**
   * Convenience reference to the autocomplete component.
   *
   * @property autocomplete
   * @private
   */

  autocomplete: alias('parentView.parentView'),

  /**
   * Registers itself with the autocomplete component.
   *
   * @method registerWithAutocomplete
   * @private
   */

  registerWithAutocomplete: function() {
    this.get('autocomplete').registerOption(this);
  }.on('willInsertElement'),

  /**
   * Unregisters itself with the suggest component.
   *
   * @method unregisterWithAutocomplete
   * @private
   */

  unregisterWithAutocomplete: function() {
    this.get('autocomplete').removeOption(this);
  }.on('willDestroyElement'),

  /**
   * Selects this option on click.
   *
   * @method selectOnClick
   * @private
   */

  selectOnClick: function(event) {
    event.stopPropagation();
    this.get('autocomplete').selectOption(this);
  }.on('click'),

  /**
   * Focuses this option.
   *
   * @method focus
   * @param options Object
   *   @property focusElement Boolean defaults true, if false, will not focus
   *   the dom element this is important for scenarios where we are closing the
   *   list but still need to track the focused option so keyboard navigation
   *   starts in the right place.
   * @private
   */

  focus: function(options) {
    options = options || {};
    this.set('focused', true);
    if (options.focusElement !== false) {
      var isClosed = !this.get('autocomplete.isOpen');
      var el = this.get('element');
      if (isClosed) {
        this.get('autocomplete').open();
        // can't focus an element that isn't visible
        Ember.run.scheduleOnce('afterRender', el, 'focus', 0);
      } else {
        el.focus();
      }
    }
  },

  /**
   * Blurs this option
   *
   * @method blur
   * @private
   */

  blur: function() {
    // TODO: if we don't care about focused, we don't need this method
    this.set('focused', false);
  },

  /**
   * @method focusOnMouseenter
   * @private
   */

  focusOnMouseenter: function() {
    // TODO: this makes mousing around a list with overflow kinda weird.  We do
    // it so that keyboard navigation works straight from the last hovered
    // element when users switch from mouse to keyboard.  I'm thinking of
    // tracking the last mouseEntered option instead of piggy backing with the
    // code that deals with focusing.
    this.get('autocomplete').focusOption(this);
  }.on('mouseEnter'),

  /**
   * @method deselect
   * @private
   */

  deselect: function() {
    this.set('isSelected', false);
  },

  /**
   * @method select
   * @private
   */

  select: function() {
    this.set('isSelected', true);
  }

});
},{}],4:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({

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
},{}],5:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

exports["default"] = Ember.Component.extend({

  tagName: 'ic-autocomplete',

  attributeBindings: [
    'is-open'
  ],

  inputValue: '',

  autocomplete: true,

  /**
   * Two-way bound property representing the current value.
   *
   * @property value
   * @public
   */

  value: null,

  /**
   * Becomes the placeholder of the input
   *
   * @property placeholder
   * @public
   */

  placeholder: null,

  /**
   * Attribute binding to allow styling of the component when it is open or
   * not. Style with `ic-autocomplete[is-open] {}`
   *
   * @property is-open
   * @readonly
   */

  'is-open': function() {
    return this.get('isOpen') ? 'true' : null;
  }.property('isOpen'),

  /**
   * Determines whether or not the list is open.
   *
   * @property isOpen
   * @readonly
   */

  isOpen: false,

  /**
   * Adds the cache to track all options in the list to facilitate option
   * focus, blur, and navigation, etc.
   *
   * @method createOptions
   * @private
   */

  createOptions: function() {
    this.set('options', Ember.ArrayProxy.create({content: []}));
    this.optionsMap = {};
  }.on('init'),

  /**
   * Opens the list.
   *
   * @method open
   * @public
   */

  open: function() {
    if (this.get('isOpen')) return;
    this.set('isOpen', true);
  },

  /**
   * Occasionally we want to focus the input without triggering the list to open,
   * when this is true, the focus handler will be ignored.
   *
   * @property ignoreInputFocus
   * @private
   */

  ignoreInputFocus: false,

  /**
   * Closes the popover.
   *
   * @method close
   * @public
   */

  close: function() {
    if (!this.get('isOpen')) return;
    this.set('isOpen', false);
    var focusedOption = this.get('focusedOption');
    if (focusedOption) {
      focusedOption.blur();
      // so that keyboard starts at the right place on "down" or "up"
      this.set('focusedOption', this.get('selected'));
    }
    // if the active element is an element in the component, then we want to
    // focus the input and prevent the focus from opening it again
    if (this.get('element').contains(document.activeElement)) {
      this.set('ignoreInputFocus', true);
      Ember.run.later(this, 'set', 'ignoreInputFocus', false, 0);
      this.get('input').focus();
    }
  },

  /**
   * Selects an option.
   *
   * @method selectOption
   * @param option AutocompleteOptionComponent
   * @param options Object - TODO: kill these options, should instead make
   * `selectOption` do less, and have the call sites do the other operations
   * (like focusing the input, etc).
   *   @property close Boolean - Defaults true; if false, the menu will not
   *   close after the option is selected.
   *   @property focus Boolean - Defaults true; if false, the input will not
   *   get focus.
   *   @property focusOption Boolean - Defaults true; if false, the option will
   *   not get focus.
   * @private
   */

  selectOption: function(option, options) {
    options = options || {};
    var selected = this.get('selected');
    if (selected) selected.deselect();
    this.set('selected', option);
    this.set('inputValue', this.get('selected.label'));
    option.select();
    this.focusOption(option, {focusElement: options.focusOption});
    if (options.focus !== false) {
      this.get('input').focus();
    }
    if (options.close !== false) {
      this.close();
    }
    this.sendAction('on-select', this, option);
  },

  /**
   * Handle case where apps reset the list on select, you get new options
   * all registering and therefore an infinite loop of selecting the option
   * whose value matches the current value
   *
   * TODO: DRY up with selectOption (maybe?), or maybe there's a better way
   * to prevent this when the option registers? The fact that we're doing the
   * same operation minus some side-effects is unsettling.
   *
   * @method selectOptionWithoutPotentialRecursion
   * @private
   */

  selectOptionWithoutPotentialRecursion: function(option) {
    this.set('selected', option);
    option.select();
    this.focusOption(option, {focus: false});
  },

  /**
   * @method setValueFromSelected
   * @private
   */

  setValueFromSelected: function() {
    this.set('value', this.get('selected.value'));
  }.observes('selected'),

  /**
   * Adds an option to the options cache, selects it if the value matches.
   *
   * @method registerOption
   * @private
   */

  registerOption: function(option) {
    this.get('options').pushObject(option);
    this.optionsMap[option.get('value')] = option;
    if (this.get('value') === option.get('value')) {
      if (this.get('selected')) {
        // When a new option shows up with matching attributes as the selected
        // option, select this new one instead but don't explode...  TODO: use
        // `ignoreInputFocus` or probably better, when a the selection option
        // is unregistered, clear out `selected` and then we dont' have to do
        // this dance.
        this.selectOptionWithoutPotentialRecursion(option);
      } else {
        // When an option shows up with a matching value, select it but don't
        // focus because we don't want to steal focus from the rest of the
        // page, the user isn't actually interacting with the component.
        this.selectOption(option, {focus: false});
      }
    }
    if (this.get('isOpen') && this.get('inputValue')) {
      Ember.run.scheduleOnce('afterRender', this, 'autocompleteText');
    }
  },

  /**
   * Removes an option from the options cache.
   *
   * TODO: should probably get rid of 'selected' if its selected.
   *
   * @method removeOption
   * @private
   */

  removeOption: function(optionComponent) {
    if (this.get('focusedOption') === optionComponent) {
      this.set('focusedOption', null);
    }
    this.get('options').removeObject(optionComponent);
  },

  /**
   * We don't want autocomplete to happen on backspace (feels super weird),
   * so set the `isBackspacing` property so autocomplete won't do its thing.
   *
   * @method startBackspacing
   * @private
   */

  startBackspacing: function() {
    // prevents autocomplete from not happening (yes, double negative) on
    // backspacing an empty input
    // TODO: remember what the side-effect is ...
    if (this.get('inputValue') === '') {
      return;
    }
    this.set('isBackspacing', true);
  },

  /**
   * Flow control for handling keydown.
   *
   * @property keydownMap
   * @private
   */

  keydownMap: {
    27/*esc*/:   'close',
    32/*space*/: 'maybeSelectFocusedOption',
    13/*enter*/: 'maybeSelectOnEnter',
    40/*down*/:  'focusNext',
    38/*up*/:    'focusPrevious',
    8/*backspace*/: 'startBackspacing'
  },

  /**
   * Handles keyboard interactions from all elements in the component.
   *
   * @method handleKeydown
   * @private
   */
 
  handleKeydown: function(event) {
    var map = this.get('keydownMap');
    var method = map[event.keyCode];
    if (this[method]) {
      return this[method](event);
    }
    var input = this.get('input');
    // After this we focus the input, but if they are using shift, we don't
    // want to actually do it (they are probably shift+tabbing away). This is a
    // blacklist of one, which makes me really nervous. We want to allow any
    // valid input character, but that's a huge whitelist, or maybe use the
    // run loop and wait for focus to settle on the new element and then decide
    // what to do.
    if (event.shiftKey) {
      return;
    }
    if (document.activeElement !== input) {
      input.focus();
      // if its not backspace, then we want to select the input, since its
      // keyDown, then on keyUp the contents will be replaced, but with
      // backspace, we dont' want to do that.
      if (event.keyCode !== 8/*backspace*/) {
        input.select();
      }
    }
  }.on('keyDown'),

  /**
   * When the user is typing we autocomplete with the label of the first option
   * in the list. The autocompleted text gets selected so the component doesn't
   * get in the way of typing.
   *
   * @method autocompleteText
   * @private
   */

  autocompleteText: function() {
    this.set('autocompletedOption', null);
    if (!this.get('isOpen') || !this.get('options.length')) {
      return;
    }
    if (this.get('isBackspacing')) {
      this.set('isBackspacing', false);
      return;
    }
    var first = this.get('options').objectAt(0);
    if (first == this.get('autocompletedOption')) {
      return;
    }
    var label = first.get('label');
    var input = this.get('inputValue');
    if (input === '') {
      return;
    }
    if (label.toLowerCase().indexOf(input.toLowerCase()) == -1) {
      return
    }
    var fragment = label.substring(input.length);
    // since we are setting the input's value, we don't want the observers
    // doing their thing
    this.set('ignoreInputValue', true);
    // tests need this, if the body is the active element when the test starts
    // then it fails, if anything else has focus its fine :\
    this.set('ignoreInputFocus', true);
    Ember.run.later(this, 'set', 'ignoreInputFocus', false, 0);
    var el = this.get('input');
    el.value = label;
    el.setSelectionRange(input.length, label.length);
    this.set('autocompletedOption', first);
  },

  /**
   * Observes the input's value and does a bunch of stuff... including sending
   * the `on-input` action.
   *
   * @method onInput
   * @private
   */

  onInput: function() {
    if (!this.get('isOpen')) {
      this.open();
    }
    // autocomplete set it, so just bail
    if (this.get('ignoreInputValue')) {
      this.set('ignoreInputValue', false);
      return;
    }
    // we don't match anymore, clear selected, TODO: clear focused too?
    if (this.get('selected.label') !== this.get('inputValue')) {
      this.set('selected', null);
    }
    if (this.get('selected')) {
      // TODO: WHY IS THIS HERE!?
      return;
    }
    this.sendAction('on-input', this, this.get('inputValue'));
    // TODO: later because ???
    if (this.get('autocomplete')) {
      Ember.run.scheduleOnce('afterRender', this, 'autocompleteText');
    }
  }.observes('inputValue'),

  /**
   * Focuses the next option in the list.
   *
   * @method focusNext
   * @private
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

  /**
   * Focuses the previous option in the popover.
   *
   * @method focusPrevious
   * @private
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

  /**
   * Focuses an option given an index in the options cache.
   *
   * @method focusOptionAtIndex
   * @private
   */

  focusOptionAtIndex: function(index) {
    var options = this.get('options');
    // loop it when at the ends
    if (index === -1) {
      index = options.get('length') - 1;
    } else if (index === options.get('length')) {
      index = 0;
    }
    var option = this.get('options').objectAt(index);
    if (!option) return;
    this.focusOption(option);
  },

  /**
   * Sets the option as the `focusedOption`
   *
   * @method focusOption
   * @private
   */

  focusOption: function(option, options) {
    options = options || {};
    var focusedOption = this.get('focusedOption');
    if (focusedOption) {
      focusedOption.blur();
    }
    this.set('focusedOption', option);
    if (options.focus !== false) {
      option.focus(options);
    }
  },

  /**
   * Selects the focused item if there is one.
   *
   * @method maybeSelectFocusedOption
   * @private
   */

  maybeSelectFocusedOption: function() {
    var focused = this.get('focusedOption');
    if (focused) {
      this.selectOption(focused);
      return true;
    }
    return false;
  },

  /**
   * Selects the autocompleted option if there is one.
   *
   * @method maybeSelectAutocompletedOption
   * @private
   */

  maybeSelectAutocompletedOption: function() {
    var option = this.get('autocompletedOption');
    if (option) {
      this.selectOption(option, {focus: false, focusOption: false});
      this.set('autocompletedOption', null);
    }
  },

  /**
   * Selects the focused or autocompleted option when the user hits enter on
   * the keyboard. This is nice because then it selects all the text so they
   * can start typing again without having to delete everything first.
   *
   * @method maybeSelectOnEnter
   * @private
   */

  maybeSelectOnEnter: function(event) {
    event.preventDefault();
    var selectedFocused = this.maybeSelectFocusedOption();
    // TODO: fix this, its smelly. autocompleteText clears out autocompleted
    // option, but if a new option shows up and gets autocompleted, nothing
    // clears out autocompletedOption, so we only want to select it if we
    // didn't select a focused option.
    if (!selectedFocused) {
      this.maybeSelectAutocompletedOption();
    }
    this.get('input').select();
  },

  /**
   * Finds the input element
   * TODO: do the typical register call from the input component instead
   *
   * @method registerInput
   * @private
   */

  registerInput: function() {
    this.set('input', this.$('input')[0]);
  }.on('didInsertElement'),

  /**
   * @method registerList
   * @private
   */

  registerList: function(list) {
    this.set('list', list);
  },

  /**
   * @method toggleVisibility
   * @public
   */

  toggleVisibility: function() {
    if (this.get('isOpen')) {
      this.close();
    } else {
      this.open();
    }
  },

  /**
   * Closes the list when focus moves away from the component. If there is a
   * valid autocomplete happening, it selects it (it would be weird
   * to have a valid label inside the text field but not have the autocomplete
   * `value` match).
   *
   * @method closeOnFocusOut
   * @private
   */

  closeOnFocusOut: function() {
    // later for document.activeElement to be correct
    Ember.run.later(this, function() {
      // TODO: maybe handle focusOut of the elements we know about instead of an
      // overarching check here?
      if (!this.get('element').contains(document.activeElement)) {
        this.maybeSelectAutocompletedOption();
        this.close();
      }
    }, 0);
  }.on('focusOut'),

  /**
   * Observes the `value` property and selects the option with a matching value
   * if there is one.
   *
   * @method bindValue
   * @private
   */

  bindValue: function() {
    var selected = this.get('selected');
    var value = this.get('value');
    // don't do the work if we know nothing is going to match.
    if (!selected && (value == null || value === '')) {
      return;
    }
    // if it already matches, don't do any work
    if (selected && value === selected.get('value')) {
      return;
    }
    var option = this.optionsMap[value];
    if (option) {
      // TODO: learn why we need the run loop here for the tests
      Ember.run(this, 'selectOption', option);
    }
  }.observes('value')

});
},{}],6:[function(_dereq_,module,exports){
"use strict";
var Application = window.Ember.Application;
var autocompleteCss = _dereq_("./templates/autocomplete-css")["default"] || _dereq_("./templates/autocomplete-css");
var autocompleteTemplate = _dereq_("./templates/autocomplete")["default"] || _dereq_("./templates/autocomplete");
var AutocompleteComponent = _dereq_("./autocomplete")["default"] || _dereq_("./autocomplete");
var AutocompleteOptionComponent = _dereq_("./autocomplete-option")["default"] || _dereq_("./autocomplete-option");
var AutocompleteToggleComponent = _dereq_("./autocomplete-toggle")["default"] || _dereq_("./autocomplete-toggle");
var AutocompleteInputComponent = _dereq_("./autocomplete-input")["default"] || _dereq_("./autocomplete-input");
var AutocompleteListComponent = _dereq_("./autocomplete-list")["default"] || _dereq_("./autocomplete-list");

Application.initializer({
  name: 'ic-modal',
  initialize: function(container) {
    container.register('template:components/ic-autocomplete', autocompleteTemplate);
    container.register('template:components/ic-autocomplete-css', autocompleteCss);
    container.register('component:ic-autocomplete', AutocompleteComponent);
    container.register('component:ic-autocomplete-option', AutocompleteOptionComponent);
    container.register('component:ic-autocomplete-toggle', AutocompleteToggleComponent);
    container.register('component:ic-autocomplete-input', AutocompleteInputComponent);
    container.register('component:ic-autocomplete-list', AutocompleteListComponent);
  }
});

exports.autocompleteCss = autocompleteCss;
exports.autocompleteTemplate = autocompleteTemplate;
exports.AutocompleteComponent = AutocompleteComponent;
exports.AutocompleteOptionComponent = AutocompleteOptionComponent;
exports.AutocompleteToggleComponent = AutocompleteToggleComponent;
exports.AutocompleteInputComponent = AutocompleteInputComponent;
exports.AutocompleteListComponent = AutocompleteListComponent;
},{"./autocomplete":5,"./autocomplete-input":1,"./autocomplete-list":2,"./autocomplete-option":3,"./autocomplete-toggle":4,"./templates/autocomplete":8,"./templates/autocomplete-css":7}],7:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
exports["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("ic-autocomplete {\n  display: inline-block;\n  position: relative;\n}\n\nic-autocomplete-list {\n  display: none;\n  position: absolute;\n  z-index: 1;\n  border: 1px solid #aaa;\n  background: #fff;\n  top: 100%;\n  padding: 5px 0px;\n  max-height: 400px;\n  overflow: auto;\n  font-size: 12px;\n  width: 100%;\n  -moz-box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\nic-autocomplete[is-open] ic-autocomplete-list {\n  display: block;\n}\n\nic-autocomplete-option {\n  display: block;\n  padding: 2px 16px;\n  cursor: default;\n}\n\nic-autocomplete-option:focus {\n  outline: 0;\n  color: white;\n  background: hsl(200, 50%, 50%);\n}\n\nic-autocomplete-option[selected]:before {\n  content: '✓';\n  position: absolute;\n  left: 4px;\n}\n\nic-autocomplete-toggle {\n  display: inline-block;\n  outline: none;\n  position: absolute;\n  top: 2px;\n  right: 6px;\n  font-size: 14px;\n  cursor: default;\n}\n\n.ic-autocomplete-input {\n  position: relative;\n  padding-right: 20px;\n  width: 100%;\n  -moz-box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n");
  
});
},{}],8:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
exports["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("▾");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n  ");
  stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  }

  data.buffer.push(escapeExpression((helper = helpers['ic-autocomplete-input'] || (depth0 && depth0['ic-autocomplete-input']),options={hash:{
    'value': ("inputValue"),
    'aria-label': ("placeholder"),
    'placeholder': ("placeholder")
  },hashTypes:{'value': "ID",'aria-label': "ID",'placeholder': "ID"},hashContexts:{'value': depth0,'aria-label': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "ic-autocomplete-input", options))));
  data.buffer.push("\n\n");
  options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
  if (helper = helpers['ic-autocomplete-toggle']) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0['ic-autocomplete-toggle']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers['ic-autocomplete-toggle']) { stack1 = blockHelperMissing.call(depth0, 'ic-autocomplete-toggle', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}
  if (helper = helpers['ic-autocomplete-list']) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0['ic-autocomplete-list']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers['ic-autocomplete-list']) { stack1 = blockHelperMissing.call(depth0, 'ic-autocomplete-list', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  return buffer;
  
});
},{}]},{},[6])
(6)
});