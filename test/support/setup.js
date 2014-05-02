emq.globalize();

setResolver(Ember.DefaultResolver.extend({
  testSubjects: {
    'component:ic-autocomplete': ic.autocomplete.AutocompleteComponent,
    'component:ic-autocomplete-option': ic.autocomplete.AutocompleteOptionComponent,
    'component:ic-autocomplete-toggle': ic.autocomplete.AutocompleteToggleComponent,
    'component:ic-autocomplete-input': ic.autocomplete.AutocompleteInputComponent,
    'component:ic-autocomplete-list': ic.autocomplete.AutocompleteListComponent,
    'template:components/ic-autocomplete': ic.autocomplete.autocompleteTemplate,
    'template:components/ic-autocomplete-css': ic.autocomplete.autocompleteCss
  },
  resolve: function(fullName) {
    return this.testSubjects[fullName] || this._super.apply(this, arguments);
  }
}).create());

Function.prototype.compile = function() {
  var template = this.toString().split('\n').slice(1,-1).join('\n') + '\n';
  return Ember.Handlebars.compile(template);
};

function lookupComponent(id) {
  return Ember.View.views[id];
}

