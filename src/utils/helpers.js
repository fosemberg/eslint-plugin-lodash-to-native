const {findVariable} = require('eslint-utils');
const {TYPE} = require('./constants');

const checkIsLodashOverridden = (context, node) => {
  const lodashReferences = findVariable(context.getScope(), '_')?.references;
  if (lodashReferences) {
    for (const reference of lodashReferences) {
      if (reference.init === false && reference.identifier.start < node.start) {
        return true;
      }
    }
  }
  return false;
};

const checkIsArray = (context, node) => {
  const firstArgument = node.arguments[0];
  const scope = context.getScope(node);
  return firstArgument.type === TYPE.ARRAY_EXPRESSION ||
    (
      firstArgument.type !== TYPE.LITERAL &&
      firstArgument.type !== TYPE.OBJECT_EXPRESSION &&
      scope.set.get(firstArgument.name).defs[0].node.init.type === TYPE.ARRAY_EXPRESSION
    )
}

const getArgumentFromNodeInContext = (context, node, index = 0) =>
  context
    .getSourceCode()
    .getText(node.arguments[index]);

const getType = (context, name) =>
  name
    ? findVariable(context.getScope(), name)
      ?.identifiers[0]
      ?.parent
      ?.init
      ?.type
    : undefined;

const getArgNodeText = (context, argNode) => context.getSourceCode().getText(argNode);

module.exports = {
  checkIsLodashOverridden,
  checkIsArray,
  getArgumentFromNodeInContext,
  getType,
  getArgNodeText,
}
