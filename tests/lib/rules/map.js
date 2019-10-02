/**
 * @fileoverview convert lodash map to native
 * @author fosemberg
 */
"use strict"; //------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var _require = require("eslint"),
    RuleTester = _require.RuleTester;

var rule = require("../../../lib/rules/map");

var _require2 = require('../../../utils/constants'),
    MAP = _require2.MAP; //------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


var ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018
  }
});
ruleTester.run('map', rule, {
  valid: ["_.map({foo: 1, bar: 2}, f);"],
  invalid: [{
    code: "_.map(['foo', 'bar'], f);",
    errors: [{
      message: MAP.REPORT_MESSAGE
    }],
    output: "['foo', 'bar'].map(f);"
  }, {
    code: "var arr = ['foo', 'bar'];\n" + "_.map(arr, f);",
    errors: [{
      message: MAP.REPORT_MESSAGE
    }]
  }, {
    code: "_.map('foo', f);",
    errors: [{
      message: MAP.REPORT_MESSAGE
    }]
  }, {
    code: "var foo = 'foo';\n" + "_.map(foo, f);",
    errors: [{
      message: MAP.REPORT_MESSAGE
    }]
  }]
});