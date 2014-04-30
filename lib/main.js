import { Application } from 'ember';
import comboboxCss from './templates/combobox-css';
import comboboxTemplate from './templates/combobox';
import ComboboxComponent from './combobox';
import ComboboxOptionComponent from './combobox-option';
import ComboboxToggleComponent from './combobox-toggle';
import ComboboxInputComponent from './combobox-input';

Application.initializer({
  name: 'ic-modal',
  initialize: function(container) {
    container.register('template:components/ic-combobox', comboboxTemplate);
    container.register('template:components/ic-combobox-css', comboboxCss);
    container.register('component:ic-combobox', ComboboxComponent);
    container.register('component:ic-combobox-option', ComboboxOptionComponent);
    container.register('component:ic-combobox-toggle', ComboboxToggleComponent);
    container.register('component:ic-combobox-input', ComboboxInputComponent);
  }
});

export {
  comboboxCss,
  comboboxTemplate,
  ComboboxComponent,
  ComboboxOptionComponent,
  ComboboxToggleComponent,
  ComboboxInputComponent
};

