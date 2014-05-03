moduleForComponent('ic-autocomplete', 'AutocompleteComponent', {
  needs: [
    'component:ic-autocomplete-option',
    'component:ic-autocomplete-toggle',
    'component:ic-autocomplete-input',
    'component:ic-autocomplete-list',
    'template:components/ic-autocomplete-css'
  ]
});

var component, autocomplete, list, options, toggle, input;

test('renders', function() {
  setup(this);
          equal(component.state, 'inDOM');
});

test('opening and closing via the toggle', function() {
  setup(this);
          ok(toggle.length);
  toggle.simulate('click');
          ok(list.is(':visible'));
  toggle.simulate('click');
          assertClosed();
});

test('opening on down arrow', function() {
  setup(this);
  openWithDownArrow();
          ok(list.is(':visible'), 'list is visible');
});

test('opens on input', function() {
  setup(this);
  input.val('u');
  input.simulate('keyup', {keyCode: 85});
          ok(list.is(':visible'), 'list is visible');
});

test('closes on focusOut', function() {
  setup(this);
  openWithDownArrow();
  input.blur();
          assertClosed();
});

test('closes on escape', function() {
  setup(this);
  openWithDownArrow();
  input.simulate('keydown', {keyCode: 27});
          assertClosed();
});

test('up/down navigate the list', function() {
  setup(this);
  openWithDownArrow();
          assertFocus(options[0], 'on UT');
  navigateList('down');
          assertFocus(options[1], 'down to IL');
  navigateList('up');
          assertFocus(options[0], 'up to UT');
  navigateList('up');
          assertFocus(options[2], 'loops up to TX');
  navigateList('down');
          assertFocus(options[0], 'loops down back to UT');
});

test('enter selects focused option', function() {
  setup(this);
  openWithDownArrow();
  options.eq(0).simulate('keydown', {keyCode: 13});
          assertSelected(lookupComponent('UT'));
          assertClosed();
});

test('spacebar selects focused option', function() {
  setup(this);
  openWithDownArrow();
  options.eq(0).simulate('keydown', {keyCode: 32});
          assertSelected(lookupComponent('UT'));
          assertClosed();
});

test('click selects option', function() {
  setup(this);
  openWithDownArrow();
  options.eq(1).simulate('click');
          assertSelected(lookupComponent('IL'));
          assertClosed();
});

test('typing in an open list returns focus to the input', function() {
  setup(this);
  openWithDownArrow();
  autocomplete.simulate('keydown', {keyCode: 85});
          assertFocus(input[0]);
});

test('typing in an open list selects input', function() {
  setup(this);
  selectOptionAtIndex(0);
  openWithDownArrow();
  autocomplete.simulate('keydown', {keyCode: 85});
          assertFocus(input[0]);
          assertSelection('Utah');
          // key up will then wipe it all out, as expected, but
          // that's just the browser, not us, no need to test
});

test('backspace in an open does not select, but focuses', function() {
  setup(this);
  selectOptionAtIndex(0);
  openWithDownArrow();
  autocomplete.simulate('keydown', {keyCode: 8});
          assertSelection('');
});

test('autocompletes text', function() {
  setup(this);
  input[0].value = 'u';
  input.simulate('keyup', {keyCode: 85});
          equal(input[0].value, 'Utah');
          assertSelection('tah', 'selects fragment');
});

test('does not autocomplete on backspace', function() {
  setup(this);
  input[0].value = 'Uta';
  input.simulate('keyup', {keyCode: 65});
          equal(input[0].value, 'Utah');
          assertSelection('h', 'selects fragment');
  input[0].value = 'Ut';
  input.simulate('keydown', {keyCode: 8});
          equal(input[0].value, 'Ut');
          assertSelection('', 'selects fragment');
});

test('selects autocompleted option on focusOut', function() {
  setup(this);
  input[0].value = 'u';
  input.simulate('keyup', {keyCode: 85});
          equal(input[0].value, 'Utah');
          assertSelection('tah', 'selects fragment');
  input.blur();
  Ember.run.next(function() {
          assertSelected(lookupComponent('UT'));
  });
});

test('arrows navigate the list from current selection', function() {
  setup(this);
  selectOptionAtIndex(1);
  openWithDownArrow();
  assertFocus($('#IL')[0]);
});

test('arrows navigate the list from last hover', function() {
  setup(this);
  openWithDownArrow();
  hoverOptionAtIndex(1);
  navigateList('down');
  assertFocus($('#TX')[0]);
});

test('aria attributes', function() {
  setup(this);
          equal(input.attr('role'), 'combobox', 'input role');
          equal(input.attr('aria-autocomplete'), 'both', 'aria-autocomplete');
          equal(input.attr('aria-owns'), list.attr('id'), 'aria-owns');
          equal(list.attr('role'), 'listbox', 'list role');
          equal(options.eq(0).attr('role'), 'option', 'option role');
          equal(list.attr('aria-expanded'), 'false', 'aria-expanded');
  selectOptionAtIndex(0);
          equal(input.attr('aria-activedescendant'), options.eq(0).attr('id'), 'aria-activedescendant');
  openWithDownArrow();
          equal(list.attr('aria-expanded'), 'true', 'aria-expanded');
});

test('responds to value being set', function() {
  setup(this);
  component.set('value', 'IL');
          assertSelected(lookupComponent('IL'));
});


function assertSelection(expected, desc) {
  equal(window.getSelection().toString(), expected, desc);
}

function navigateList(direction) {
  var code = direction == 'up' ? 38 : /*down*/40;
  $(document.activeElement).simulate('keydown', {keyCode: code});
}

function hoverOptionAtIndex(index) {
  options.eq(index).simulate('mouseover');
}

function assertFocus(el, desc) {
  equal(document.activeElement, el, desc);
}

function selectOptionAtIndex(index) {
  openWithDownArrow();
  options.eq(index).simulate('click');
}

function assertClosed() {
  ok(list.not(':visible'), 'list is not visible');
}

function assertSelected(option) {
  equal(component.get('value'), option.get('value'), 'autocomplete value is set');
  equal(input[0].value, option.get('label'), 'input value is option label');
}

function openWithDownArrow() {
  input[0].focus();
  input.simulate('keydown', {keyCode: 40});
}

function setup(test) {
  component = test.subject({
    template: function() {/*
      {{#ic-autocomplete-option id="UT" value="UT" label="Utah"}}
        Utah
      {{/ic-autocomplete-option}}
      {{#ic-autocomplete-option id="IL" value="IL" label="Illinois"}}
        Illinois
      {{/ic-autocomplete-option}}
      {{#ic-autocomplete-option id="TX" value="TX" label="Texas"}}
        Texas
      {{/ic-autocomplete-option}}
    */}.compile()
  });
  var el = test.$();
  autocomplete = el;
  input = el.find('.ic-autocomplete-input');
  list = el.find('ic-autocomplete-list');
  options = el.find('ic-autocomplete-option');
  toggle = el.find('ic-autocomplete-toggle');
}

