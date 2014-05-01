moduleForComponent('ic-autocomplete');

test('renders', function() {
  expect(2);
  var modal = this.subject({
    template: function() {/*
      {{#ic-autocomplete}}
        {{#ic-autocomplete-option value="hola" label="Hello"}}
          Hello
        {{/ic-autocomplete-option}}
      {{/ic-autocomplete}}
    */}
  });
  equal(modal.state, 'preRender');
  this.append();
  equal(modal.state, 'inDOM');
});

