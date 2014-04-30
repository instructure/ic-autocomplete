ic-autocomplete
===============

[![Build Status](https://travis-ci.org/instructure/ic-autocomplete.png?branch=master)](https://travis-ci.org/instructure/ic-autocomplete)

[WAI-ARIA][wai-aria] accessible autocomplete component (combobox) for [Ember.js][ember].

Demo
----

http://instructure.github.io/ic-autocomplete

Installation
------------

```sh
$ npm install ic-autocomplete
```

or ...

```sh
$ bower install ic-autocomplete
```

or just grab your preferred distribution from `dist/`.

Then include the script(s) into your application:

### npm+browserify

`require('ic-autocomplete')`

### amd

Register `ic-autocomplete` as a [package][rjspackage], then:

`define(['ic-autocomplete'], ...)`

### named-amd

You ought to know what you're doing if this is the case.

### globals

`<script src="bower_components/ic-styled/main.js"></script>`
`<script src="bower_components/ic-autocomplete/dist/globals/main.js"></script>`

{{ic-autocomplete}} Usage
------------------

```html
{{#ic-autocomplete

  <!-- like other input types, `value` is two-way bound to `state` -->
  value=state

  <!--
    you are responsible to filter the items, you might want to do
    ajax, or client-side, or match both ids and labels of options (like
    UT and Utah).

    Map `on-input` to an action on your controller that is called when
    the user types
  -->
  on-input="filterStates"

  <!--
    When the user makes a selection, this action is sent. You may
    want to reset your list here so when they open it again they see all the
    options
  -->
  on-select="selectState"

  placeholder="Pick a state"
}}

  <!--
    inside the autocomplete you should iterate some list of data, this
    is the data you should filter in your `on-input` handler. So as the
    user types, the data changes.
  -->
    {{#each filteredStates}}
      <!-- finally create autocomplete-options with a value and label -->
      {{#ic-autocomplete-option value=id label=name}}
        {{name}}
      {{/ic-autocomplete-option}}
    {{else}}
      <div>No results</div>
    {{/each}}
{{/ic-autocomplete}}
```

And the JavaScript:

```js
App.ApplicationController = Ember.Controller.extend({

  actions: {
    // the `on-input` actions sends the autocomplete component as the
    // first argument, and the search term the user entered as the
    // second
    filterStates: function(autocomplete, term) {
      // then we simply set the filteredStates, our `{{#each}}` will
      // respond and we'll get a new set of `ic-autocomplete-option`s
      this.set('filteredStates', this.filterStatesBy(term));    
    },

    filterWithXHR: function(autocomplete, term) {
      // you could do something like this too:
      ic.ajax.request('user_search?term='+term).then(function(states) {
        this.set('filteredStates', response.states);
      }.bind(this));
    }
  },

  states: [{label: 'Utah', id: 'UT'}, {label: 'Illinois', id: 'IL'}],

  filterStatesBy: function(term) {
    var term = this.get('stateFilterTerm');
    if (term == '') return this.get('states');
    var filter = new RegExp('^'+term, 'i');
    return this.get('states').filter(function(state) {
      // filtering is up to you because you might want to do something
      // awesome like this, searching on name and id
      return filter.test(state.name) || filter.test(state.id);
    });
  }

});
```

Contributing
------------

```sh
$ git clone <this repo>
$ npm install
$ npm test
# during dev
$ broccoli serve
# localhost:4200/globals/main.js instead of dist/globals/main.js
# new tab
$ karma start
```

Make a new branch, send a pull request, squashing commits into one
change is preferred.

  [rjspackage]:http://requirejs.org/docs/api.html#packages
  [ember]:http://emberjs.com
  [wai-aria]:http://www.w3.org/TR/wai-aria/roles#combobox

