import { Application } from 'ember';
import autocompleteCss from './templates/autocomplete-css';
import autocompleteTemplate from './templates/autocomplete';
import AutocompleteComponent from './autocomplete';
import AutocompleteOptionComponent from './autocomplete-option';
import AutocompleteToggleComponent from './autocomplete-toggle';
import AutocompleteInputComponent from './autocomplete-input';
import AutocompleteListComponent from './autocomplete-list';

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

export {
  autocompleteCss,
  autocompleteTemplate,
  AutocompleteComponent,
  AutocompleteOptionComponent,
  AutocompleteToggleComponent,
  AutocompleteInputComponent,
  AutocompleteListComponent
};

