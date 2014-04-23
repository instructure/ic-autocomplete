import { Application } from 'ember';
import AutocompleteComponent from './autocomplete';
import autocompleteCss from './templates/autocomplete-css';

Application.initializer({
  name: 'ic-modal',
  initialize: function(container) {
    container.register('component:ic-autocomplete', AutocompleteComponent);
    container.register('template:components/ic-autocomplete-css', autocompleteCss);
  }
});

export {
  AutocompleteComponent,
  autocompleteCss
};

