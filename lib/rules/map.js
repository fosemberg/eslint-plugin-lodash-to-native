/**
 * @fileoverview convert lodash map to native
 * @author fosemberg
 */
"use strict"; //------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var _require = require('../../utils/constants'),
    MAP = _require.MAP,
    TYPE = _require.TYPE;

var _require2 = require('../../utils/helpers'),
    checkIsLodashOverridden = _require2.checkIsLodashOverridden,
    getType = _require2.getType,
    getArgNodeText = _require2.getArgNodeText; //------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


var generateNativeExpression = function generateNativeExpression(context, node) {
  return "".concat(getArgNodeText(context, node.arguments[0]), ".map(").concat(getArgNodeText(context, node.arguments[1]), ")");
};

var replaceLodashMapOnNative = function replaceLodashMapOnNative(context, node, fixer) {
  return fixer.replaceText(node, generateNativeExpression(context, node));
};

var generateFixWithCheck = function generateFixWithCheck(prop, callback) {
  return "(function(prop, callback) {\n  return Array.isArray(prop)\n    ? prop.map(callback)\n    : _.map(prop, callback);\n  })(".concat(prop, ", ").concat(callback, ")");
};

var replaceLodashMapOnNativeWithCheck = function replaceLodashMapOnNativeWithCheck(context, node, fixer) {
  return fixer.replaceText(node, generateFixWithCheck(getArgNodeText(context, node.arguments[0]), getArgNodeText(context, node.arguments[1])));
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Array.map() instead of lodash _.map()'
    },
    fixable: 'true'
  },
  create: function create(context) {
    return {
      "CallExpression[callee.object.name='_'][callee.property.name='map']": function CallExpressionCalleeObjectName_CalleePropertyNameMap(node) {
        var _node$arguments$, _node$arguments$2;

        if (checkIsLodashOverridden(context, node)) return;

        switch ((_node$arguments$ = node.arguments[0]) === null || _node$arguments$ === void 0 ? void 0 : _node$arguments$.type) {
          case TYPE.OBJECT_EXPRESSION:
            break;

          case TYPE.ARRAY_EXPRESSION:
            context.report({
              node: node,
              message: MAP.REPORT_MESSAGE,
              fix: function fix(fixer) {
                return replaceLodashMapOnNative(context, node, fixer);
              }
            });
            break;

          case TYPE.IDENTIFIER:
            var type = getType(context, (_node$arguments$2 = node.arguments[0]) === null || _node$arguments$2 === void 0 ? void 0 : _node$arguments$2.name);

            if (type === TYPE.ARRAY_EXPRESSION) {
              context.report({
                node: node,
                message: MAP.REPORT_MESSAGE,
                fix: function fix(fixer) {
                  return replaceLodashMapOnNative(context, node, fixer);
                }
              });
              break;
            } else if (type === TYPE.OBJECT_EXPRESSION) {
              break;
            }

          default:
            if (['ReturnStatement', 'VariableDeclarator', 'AssignmentExpression', 'ExpressionStatement'].includes(node.parent.type)) {
              context.report({
                node: node,
                message: MAP.REPORT_MESSAGE,
                fix: function fix(fixer) {
                  return replaceLodashMapOnNativeWithCheck(context, node, fixer);
                }
              });
            }

            break;
        }
      }
    };
  }
};