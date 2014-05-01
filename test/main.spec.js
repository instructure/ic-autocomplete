moduleForComponent('ic-autocomplete', 'AutocompleteComponent', {
  needs: [
    'component:ic-autocomplete-option',
    'component:ic-autocomplete-toggle',
    'component:ic-autocomplete-input',
    'template:components/ic-autocomplete-css'
  ]
});

var autocomplete, list, options, toggle, input;

test('renders', function() {
  setup(this);
          equal(autocomplete.state, 'inDOM');
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
  open();
          ok(list.is(':visible'), 'list is visible');
});

test('opens on input', function() {
  setup(this);
  input.simulate('keyup', {keyCode: 85});
          ok(list.is(':visible'), 'list is visible');
});

test('closes on focusOut', function() {
  setup(this);
  open(this);
  input.blur();
          assertClosed();
});

test('closes on escape', function() {
  setup(this);
  open(this);
  input.simulate('keydown', {keyCode: 27});
          assertClosed();
});

test('up/down navigate the list', function() {
  setup(this);
  open(this);
          equal(options[0], document.activeElement);
  list.simulate('keydown', {keyCode: 40});
          equal(options[1], document.activeElement, 'down');
  list.simulate('keydown', {keyCode: 38});
          equal(options[0], document.activeElement, 'up');
  list.simulate('keydown', {keyCode: 38});
          equal(options[1], document.activeElement, 'loops up');
  list.simulate('keydown', {keyCode: 40});
          equal(options[0], document.activeElement, 'loops down');
});

test('enter selects focused option', function() {
  setup(this);
  open(this);
  options.eq(0).simulate('keydown', {keyCode: 13});
          assertSelected(lookupComponent('UT'));
          assertClosed();
});

test('spacebar selects focused option', function() {
  setup(this);
  open(this);
  options.eq(0).simulate('keydown', {keyCode: 32});
          assertSelected(lookupComponent('UT'));
          assertClosed();
});

test('click selects option', function() {
  setup(this);
  open(this);
  options.eq(1).simulate('click');
          assertSelected(lookupComponent('IL'));
          assertClosed();
});

test('typing in an open list returns focus to the input', function() {
  setup(this);
  open(this);
  autocomplete.$().simulate('keydown', {keyCode: 85});
          equal(input[0], document.activeElement);
});

test('autocompletes text', function() {
  setup(this);
  input[0].value = 'u';
  input.simulate('keyup', {keyCode: 85});
          equal(input[0].value, 'Utah');
          equal(window.getSelection().toString(), 'tah', 'selects fragment');
});

test('does not autocomplete on backspace', function() {
  ok(true, 'pending');
  //setup(this);
  //input[0].value = 'Uta';
  //input.simulate('keyup', {keyCode: 8});
          //equal(input[0].value, 'Uta');
          //equal(window.getSelection().toString(), '');
});

test('selects on focusOut of valid autocomplete', function() {
  setup(this);
  input[0].value = 'u';
  input.simulate('keyup', {keyCode: 85});
          equal(input[0].value, 'Utah');
          equal(window.getSelection().toString(), 'tah', 'selects fragment');
  input.blur();
  Ember.run.next(function() {
          assertSelected(lookupComponent('UT'));
  });
});

//test('arrows navigate the list from current selection');
//test('arrows navigate the list from last hover');
//test('aria attributes');



function assertClosed() {
  ok(list.not(':visible'), 'list is not visible');
}

function assertSelected(option) {
  equal(autocomplete.get('value'), option.get('value'), 'autocomplete value is set');
  equal(input[0].value, option.get('label'), 'input value is option label');
}

function open() {
  input[0].focus();
  input.simulate('keydown', {keyCode: 40});
}

function setup(test) {
  autocomplete = test.subject({
    template: function() {/*
      {{#ic-autocomplete-option id="UT" value="UT" label="Utah"}}
        Utah
      {{/ic-autocomplete-option}}
      {{#ic-autocomplete-option id="IL" value="IL" label="Illinois"}}
        Illinois
      {{/ic-autocomplete-option}}
    */}.compile()
  });
  var el = test.$();
  input = el.find('.ic-autocomplete-input');
  list = el.find('ic-autocomplete-list');
  options = el.find('ic-autocomplete-option');
  toggle = el.find('ic-autocomplete-toggle');
}

