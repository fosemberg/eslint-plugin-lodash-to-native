"use strict";

var _require = require('eslint-utils'),
    findVariable = _require.findVariable;

var _require2 = require('./constants'),
    TYPE = _require2.TYPE;

var checkIsLodashOverridden = function checkIsLodashOverridden(context, node) {
  var _findVariable;

  var lodashReferences = (_findVariable = findVariable(context.getScope(), '_')) === null || _findVariable === void 0 ? void 0 : _findVariable.references;

  if (lodashReferences) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = lodashReferences[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var reference = _step.value;

        if (reference.init === false && reference.identifier.start < node.start) {
          return true;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return false;
};

var checkIsArray = function checkIsArray(context, node) {
  var firstArgument = node.arguments[0];
  var scope = context.getScope(node);
  return firstArgument.type === TYPE.ARRAY_EXPRESSION || firstArgument.type !== TYPE.LITERAL && firstArgument.type !== TYPE.OBJECT_EXPRESSION && scope.set.get(firstArgument.name).defs[0].node.init.type === TYPE.ARRAY_EXPRESSION;
};

var getArgumentFromNodeInContext = function getArgumentFromNodeInContext(context, node) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return context.getSourceCode().getText(node.arguments[index]);
};

var getType = function getType(context, name) {
  var _findVariable2, _findVariable2$identi, _findVariable2$identi2, _findVariable2$identi3;

  return name ? (_findVariable2 = findVariable(context.getScope(), name)) === null || _findVariable2 === void 0 ? void 0 : (_findVariable2$identi = _findVariable2.identifiers[0]) === null || _findVariable2$identi === void 0 ? void 0 : (_findVariable2$identi2 = _findVariable2$identi.parent) === null || _findVariable2$identi2 === void 0 ? void 0 : (_findVariable2$identi3 = _findVariable2$identi2.init) === null || _findVariable2$identi3 === void 0 ? void 0 : _findVariable2$identi3.type : undefined;
};

var getArgNodeText = function getArgNodeText(context, argNode) {
  return context.getSourceCode().getText(argNode);
};

module.exports = {
  checkIsLodashOverridden: checkIsLodashOverridden,
  checkIsArray: checkIsArray,
  getArgumentFromNodeInContext: getArgumentFromNodeInContext,
  getType: getType,
  getArgNodeText: getArgNodeText
};