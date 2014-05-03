define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("▾");
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      data.buffer.push(escapeExpression((helper = helpers['ic-autocomplete-input'] || (depth0 && depth0['ic-autocomplete-input']),options={hash:{
        'value': ("inputValue"),
        'aria-label': ("placeholder"),
        'placeholder': ("placeholder")
      },hashTypes:{'value': "ID",'aria-label': "ID",'placeholder': "ID"},hashContexts:{'value': depth0,'aria-label': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "ic-autocomplete-input", options))));
      data.buffer.push("\n\n");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
      if (helper = helpers['ic-autocomplete-toggle']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['ic-autocomplete-toggle']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['ic-autocomplete-toggle']) { stack1 = blockHelperMissing.call(depth0, 'ic-autocomplete-toggle', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}
      if (helper = helpers['ic-autocomplete-list']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['ic-autocomplete-list']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['ic-autocomplete-list']) { stack1 = blockHelperMissing.call(depth0, 'ic-autocomplete-list', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      
    });
  });