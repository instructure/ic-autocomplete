moduleForComponent('ic-autocomplete');

test('renders', function() {
  expect(2);
  var autocomplete = this.subject({
    template: function() {/*
      {{#ic-autocomplete}}
        Hello
      {{/ic-autocomplete}}
    */}
  });
  equal(autocomplete.state, 'preRender');
  this.append();
  equal(autocomplete.state, 'inDOM');
});

