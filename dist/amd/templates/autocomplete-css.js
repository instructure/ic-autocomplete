define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("ic-autocomplete {\n  display: inline-block;\n  position: relative;\n}\n\nic-autocomplete-list {\n  display: none;\n  position: absolute;\n  z-index: 1;\n  border: 1px solid #aaa;\n  background: #fff;\n  top: 100%;\n  padding: 5px 0px;\n  max-height: 400px;\n  overflow: auto;\n  font-size: 12px;\n  width: 100%;\n  box-sizing: border-box;\n}\n\nic-autocomplete[is-open] ic-autocomplete-list {\n  display: block;\n}\n\nic-autocomplete-option {\n  display: block;\n  padding: 2px 16px;\n  cursor: default;\n}\n\nic-autocomplete-option:focus {\n  outline: 0;\n  color: white;\n  background: hsl(200, 50%, 50%);\n}\n\nic-autocomplete-option[selected]:before {\n  content: '✓';\n  position: absolute;\n  left: 4px;\n}\n\nic-autocomplete-toggle {\n  display: inline-block;\n  outline: none;\n  position: absolute;\n  top: 2px;\n  right: 6px;\n  font-size: 14px;\n  cursor: default;\n}\n\n.ic-autocomplete-input {\n  position: relative;\n  padding-right: 20px;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n");
      
    });
  });