define("ic-autocomplete/autocomplete-input",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    var alias = Ember.computed.alias;

    __exports__["default"] = Ember.TextField.extend({

      classNames: 'ic-autocomplete-input',

      attributeBindings: [
        'aria-autocomplete',
        'aria-expanded',
        'aria-owns',
        'aria-activedescendant',
        'role'
      ],

      role: 'combobox',

      'aria-autocomplete': 'both',

      autocomplete: alias('parentView'),

      'aria-expanded': function() {
        return this.get('autocomplete.isOpen')+'';
      }.property('autocomplete.isOpen'),

      'aria-owns': alias('parentView.elementId'),

      'aria-activedescendant': alias('parentView.selected.elementId'),

      focusIn: function() {
        if (this.get('autocomplete.preventFocusInHandler')) {
          return;
        }
        if (this.get('autocomplete.open')) {
          this.get('autocomplete').close();
        } else {
          this.get('autocomplete').open();
        }
      }

    });
  });define("ic-autocomplete/autocomplete-option",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({

      tagName: 'ic-autocomplete-option',

      attributeBindings: [
        'aria-label',
        'tabindex',
        'selected',
        'role'
      ],

      role: 'option',

      tabindex: -1,

      selected: function() {
        return this.get('isSelected') ? 'true' : null;
      }.property('isSelected'),

      focused: false,

      /*
       * Registers itself with the suggest component.
       */

      didInsertElement: function() {
        var parentView = this.get('parentView');
        parentView.registerOption(this);
      },

      /*
       * Unregisters itself with the suggest component.
       */

      willDestroyElement: function() {
        this.get('parentView').removeOption(this);
      },

      /*
       * Selects this option on click.
       */

      click: function(event) {
        event.stopPropagation();
        this.get('parentView').selectOption(this);
      },

      /*
       * Focuses this option.
       */

      focus: function(options) {
        options = options || {};
        this.set('focused', true);
        if (options.focusElement !== false) {
          this.get('element').focus();
        }
      },

      /*
       * Blurs this option
       */

      blur: function() {
        this.set('focused', false);
      },

      /*
       * Focuses on mouseenter.
       */

      mouseEnter: function() {
        // TODO: this makes mousing around a list with overflow kinda weird.
        this.get('parentView').focusOption(this);
      },

      deselect: function() {
        this.set('isSelected', false);
      },

      select: function() {
        this.set('isSelected', true);
      }

    });
  });define("ic-autocomplete/autocomplete-toggle",
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
  });define("ic-autocomplete/autocomplete",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;

    __exports__["default"] = Ember.Component.extend({

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
  });define("ic-autocomplete",
  ["ember","./templates/autocomplete-css","./templates/autocomplete","./autocomplete","./autocomplete-option","./autocomplete-toggle","./autocomplete-input","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var Application = __dependency1__.Application;
    var autocompleteCss = __dependency2__["default"] || __dependency2__;
    var autocompleteTemplate = __dependency3__["default"] || __dependency3__;
    var AutocompleteComponent = __dependency4__["default"] || __dependency4__;
    var AutocompleteOptionComponent = __dependency5__["default"] || __dependency5__;
    var AutocompleteToggleComponent = __dependency6__["default"] || __dependency6__;
    var AutocompleteInputComponent = __dependency7__["default"] || __dependency7__;

    Application.initializer({
      name: 'ic-modal',
      initialize: function(container) {
        container.register('template:components/ic-autocomplete', autocompleteTemplate);
        container.register('template:components/ic-autocomplete-css', autocompleteCss);
        container.register('component:ic-autocomplete', AutocompleteComponent);
        container.register('component:ic-autocomplete-option', AutocompleteOptionComponent);
        container.register('component:ic-autocomplete-toggle', AutocompleteToggleComponent);
        container.register('component:ic-autocomplete-input', AutocompleteInputComponent);
      }
    });

    __exports__.autocompleteCss = autocompleteCss;
    __exports__.autocompleteTemplate = autocompleteTemplate;
    __exports__.AutocompleteComponent = AutocompleteComponent;
    __exports__.AutocompleteOptionComponent = AutocompleteOptionComponent;
    __exports__.AutocompleteToggleComponent = AutocompleteToggleComponent;
    __exports__.AutocompleteInputComponent = AutocompleteInputComponent;
  });define("ic-autocomplete/templates/autocomplete-css",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("ic-autocomplete {\n  display: inline-block;\n  position: relative;\n}\n\nic-autocomplete-list {\n  display: none;\n  position: absolute;\n  z-index: 0;\n  border: 1px solid #aaa;\n  top: 100%;\n  padding: 5px 0px;\n  max-height: 400px;\n  overflow: auto;\n  font-size: 12px;\n  width: 100%;\n  box-sizing: border-box;\n}\n\nic-autocomplete[is-open] ic-autocomplete-list {\n  display: block;\n}\n\nic-autocomplete-option {\n  display: block;\n  padding: 2px 16px;\n  cursor: default;\n}\n\nic-autocomplete-option:focus {\n  outline: 0;\n  color: white;\n  background: hsl(200, 50%, 50%);\n}\n\nic-autocomplete-option[selected]:before {\n  content: '✓';\n  position: absolute;\n  left: 4px;\n}\n\nic-autocomplete-toggle {\n  display: inline-block;\n  outline: none;\n  position: absolute;\n  top: 2px;\n  right: 6px;\n  font-size: 14px;\n  cursor: default;\n  z-index: 1;\n}\n\n.ic-autocomplete-input {\n  position: relative;\n  z-index: 1;\n  padding-right: 20px;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n");
      
    });
  });define("ic-autocomplete/templates/autocomplete",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("▾");
      }

      data.buffer.push(escapeExpression((helper = helpers['ic-autocomplete-input'] || (depth0 && depth0['ic-autocomplete-input']),options={hash:{
        'value': ("inputValueBuffer"),
        'aria-label': ("placeholder"),
        'placeholder': ("placeholder")
      },hashTypes:{'value': "ID",'aria-label': "ID",'placeholder': "ID"},hashContexts:{'value': depth0,'aria-label': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "ic-autocomplete-input", options))));
      data.buffer.push("\n\n");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
      if (helper = helpers['ic-autocomplete-toggle']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['ic-autocomplete-toggle']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['ic-autocomplete-toggle']) { stack1 = blockHelperMissing.call(depth0, 'ic-autocomplete-toggle', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<ic-autocomplete-list role=\"listbox\">\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</ic-autocomplete-list>\n\n");
      return buffer;
      
    });
  });