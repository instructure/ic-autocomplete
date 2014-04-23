import { Application } from 'ember';
import ComboboxComponent from './combobox';
import comboboxCss from './templates/combobox-css';

Application.initializer({
  name: 'ic-modal',
  initialize: function(container) {
    container.register('component:ic-combobox', ComboboxComponent);
    container.register('template:components/ic-combobox-css', comboboxCss);
  }
});

export {
  ComboboxComponent,
  comboboxCss
};

