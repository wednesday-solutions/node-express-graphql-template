import { Kind, print } from 'graphql/language';

export function parseObject(typeName, ast, variables) {
  const value = {};
  ast.fields.forEach(field => {
    value[field.name.value] = parseLiteral(field.value, field.value, variables);
  });

  return value;
}

export function parseLiteral(typeName, ast, variables) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(typeName, ast, variables);
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(typeName, n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE:
      return variables?.[ast.name.value] ?? undefined;
    default:
      throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`);
  }
}

export const convertToMap = (argArr, variables = {}) => {
  const args = {};
  argArr.forEach(arg => {
    if (arg.value.kind === 'Variable') {
      args[arg.name.value] = variables[arg.value.name.value];
    } else if (arg.value.kind === 'IntValue') {
      args[arg.name.value] = parseInt(arg.value.value, 10);
    } else if (arg.value.kind === 'ObjectValue') {
      args[arg.name.value] = parseObject(Kind.OBJECT, arg.value, variables);
    } else {
      args[arg.name.value] = arg.value.value;
    }
  });
  return args;
};
