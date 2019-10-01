/**
 * @fileoverview convert lodash map to native
 * @author fosemberg
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/map"),

    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("map", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "_.map(collection, fn)",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
