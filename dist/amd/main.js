define(
  ["ember","./templates/autocomplete-css","./templates/autocomplete","./autocomplete","./autocomplete-option","./autocomplete-toggle","./autocomplete-input","./autocomplete-list","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __exports__) {
    "use strict";
    var Application = __dependency1__.Application;
    var autocompleteCss = __dependency2__["default"] || __dependency2__;
    var autocompleteTemplate = __dependency3__["default"] || __dependency3__;
    var AutocompleteComponent = __dependency4__["default"] || __dependency4__;
    var AutocompleteOptionComponent = __dependency5__["default"] || __dependency5__;
    var AutocompleteToggleComponent = __dependency6__["default"] || __dependency6__;
    var AutocompleteInputComponent = __dependency7__["default"] || __dependency7__;
    var AutocompleteListComponent = __dependency8__["default"] || __dependency8__;

    Application.initializer({
      name: 'ic-autocomplete',
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

    __exports__.autocompleteCss = autocompleteCss;
    __exports__.autocompleteTemplate = autocompleteTemplate;
    __exports__.AutocompleteComponent = AutocompleteComponent;
    __exports__.AutocompleteOptionComponent = AutocompleteOptionComponent;
    __exports__.AutocompleteToggleComponent = AutocompleteToggleComponent;
    __exports__.AutocompleteInputComponent = AutocompleteInputComponent;
    __exports__.AutocompleteListComponent = AutocompleteListComponent;
  });