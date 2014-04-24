import { Application } from 'ember';
import comboboxCss from './templates/combobox-css';
import ComboboxComponent from './combobox';
import ComboboxInputComponent from './combobox-input';
import ComboboxListComponent from './combobox-list';
import ComboboxOptionComponent from './combobox-option';
import ComboboxToggleComponent from './combobox-toggle';

Application.initializer({
  name: 'ic-modal',
  initialize: function(container) {
    container.register('template:components/ic-combobox-css', comboboxCss);
    container.register('component:ic-combobox', ComboboxComponent);
    container.register('component:ic-combobox-input', ComboboxInputComponent);
    container.register('component:ic-combobox-list', ComboboxListComponent);
    container.register('component:ic-combobox-option', ComboboxOptionComponent);
    container.register('component:ic-combobox-toggle', ComboboxToggleComponent);
  }
});

export {
  comboboxCss,
  ComboboxComponent,
  ComboboxInputComponent,
  ComboboxListComponent,
  ComboboxOptionComponent,
  ComboboxToggleComponent
};

