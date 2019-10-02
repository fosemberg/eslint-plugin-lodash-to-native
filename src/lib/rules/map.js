/**
 * @fileoverview convert lodash map to native
 * @author fosemberg
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {MAP, TYPE} = require('../../utils/constants');
const {checkIsLodashOverridden, getType, getArgNodeText} = require('../../utils/helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const generateNativeExpression = (context, node) =>
  `${getArgNodeText(context, node.arguments[0])}.map(${getArgNodeText(context, node.arguments[1])})`

const replaceLodashMapOnNative = (context, node, fixer) => (
  fixer.replaceText(
    node,
    generateNativeExpression(context, node)
  )
)

const generateFixWithCheck = (prop, callback) => (
  `(function(prop, callback) {
  return Array.isArray(prop)
    ? prop.map(callback)
    : _.map(prop, callback);
  })(${prop}, ${callback})`
)

const replaceLodashMapOnNativeWithCheck = (context, node, fixer) => (
  fixer.replaceText(
    node,
    generateFixWithCheck(getArgNodeText(context, node.arguments[0]), getArgNodeText(context, node.arguments[1]))
  )
)

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Array.map() instead of lodash _.map()',
    },
    fixable: 'true'
  },
  create: function (context) {
    return {
      "CallExpression[callee.object.name='_'][callee.property.name='map']": node => {
        if (checkIsLodashOverridden(context, node)) return;

        switch (node.arguments[0]?.type) {
          case TYPE.OBJECT_EXPRESSION:
            break;

          case TYPE.ARRAY_EXPRESSION:
            context.report({
              node,
              message: MAP.REPORT_MESSAGE,
              fix: fixer => replaceLodashMapOnNative(context, node, fixer)
            });
            break;

          case TYPE.IDENTIFIER:
            const type = getType(context, node.arguments[0]?.name);
            if (type === TYPE.ARRAY_EXPRESSION) {
              context.report({
                node,
                message: MAP.REPORT_MESSAGE,
                fix: fixer => replaceLodashMapOnNative(context, node, fixer)
              });
              break;
            } else if (type === TYPE.OBJECT_EXPRESSION) {
              break;
            }

          default:
            if ([
              'ReturnStatement',
              'VariableDeclarator',
              'AssignmentExpression',
              'ExpressionStatement'
            ].includes(node.parent.type)) {
              context.report({
                node,
                message: MAP.REPORT_MESSAGE,
                fix: fixer => replaceLodashMapOnNativeWithCheck(context, node, fixer)
              });
            }
            break;
        }
      }
    };
  }
};