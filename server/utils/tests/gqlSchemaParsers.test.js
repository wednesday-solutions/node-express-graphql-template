import { Kind, print } from 'graphql/language';
const { convertToMap, parseObject, parseLiteral } = require('../gqlSchemaParsers');
const argName = 'bid';
const argValue = 1;
const ast = {
  kind: 'ObjectValue',
  fields: [
    {
      kind: 'ObjectField',
      name: { kind: 'Name', value: argName },
      value: { kind: 'IntValue', value: argValue.toString() }
    }
  ]
};
describe('parseObject', () => {
  it('should parseObject successfully', async () => {
    const res = parseObject(Kind.OBJECT_TYPE_DEFINITION, ast);
    expect(res).toEqual({ [argName]: argValue });
  });
});

describe('parseLiteral', () => {
  it('should parseLiteral successfully for string', async () => {
    const str = 'test';
    const res = parseLiteral(Kind.STRING, { value: str, kind: Kind.STRING });
    expect(res).toEqual(str);
  });

  it('should parseLiteral successfully for boolean', async () => {
    const bool = false;
    const res = parseLiteral(Kind.BOOLEAN, { value: bool, kind: Kind.BOOLEAN });
    expect(res).toEqual(bool);
  });

  it('should parseLiteral successfully for float', async () => {
    const flt = 10.01;
    const res = parseLiteral(Kind.FLOAT, { value: `${flt}`, kind: Kind.FLOAT });
    expect(res).toEqual(flt);
  });
  it('should parseLiteral successfully for int', async () => {
    const flt = 10;
    const res = parseLiteral(Kind.FLOAT, { value: `${flt}`, kind: Kind.FLOAT });
    expect(res).toEqual(flt);
  });

  it('should parseLiteral successfully for object', async () => {
    const res = parseLiteral(Kind.OBJECT_TYPE_DEFINITION, ast);
    expect(res).toEqual({ [argName]: argValue });
  });

  it('should parseLiteral successfully for list', async () => {
    const flt = 10;
    const res = parseLiteral(Kind.LIST, { kind: Kind.LIST, values: [{ value: `${flt}`, kind: Kind.FLOAT }] });
    expect(res).toEqual([flt]);
  });

  it('should parseLiteral successfully for null', async () => {
    const res = parseLiteral(Kind.NULL, { kind: Kind.NULL });
    expect(res).toEqual(null);
  });

  it('should parseLiteral successfully for variable', async () => {
    const name = 'test';
    const value = 10;
    const res = parseLiteral(Kind.VARIABLE, { kind: Kind.VARIABLE, name: { value: name } }, { [name]: value });
    expect(res).toEqual(value);
  });

  it('should return undefined when variables doesnt have a matching value', async () => {
    const name = 'test';
    const value = 10;
    const res = parseLiteral(Kind.VARIABLE, { kind: Kind.VARIABLE, name: { value: name } }, { [`${name}1`]: value });
    expect(res).toEqual(undefined);
  });

  it('should throw error kind is invalid', async () => {
    const typeName = 'asd';
    const ast = { kind: 'asd' };
    expect(() => parseLiteral(typeName, ast)).toThrowError(`${typeName} cannot represent value: ${print(ast)}`);
  });
});

describe('convertToMap', () => {
  it('should successfully convertToMap variable', async () => {
    const a = 10;

    // variable
    const res = convertToMap(
      [
        {
          name: {
            value: 'a'
          },
          value: {
            kind: 'Variable',
            name: {
              value: 'a'
            }
          }
        }
      ],
      {
        a
      }
    );
    expect(res).toMatchObject({
      a
    });
  });

  it('should successfully convertToMap integer', async () => {
    const b = 20;

    // intValue
    const res = convertToMap(
      [
        {
          name: {
            value: 'b'
          },
          value: {
            kind: 'IntValue',
            value: `${b}`
          }
        }
      ],
      { b }
    );

    expect(res).toMatchObject({
      b
    });
  });

  it('should successfully convertToMap object', async () => {
    const cValue = 1;
    const c = { bid: cValue };

    // object value
    const res = convertToMap(
      [
        {
          name: {
            value: 'c'
          },
          value: ast
        }
      ],
      { c: cValue }
    );

    expect(res).toMatchObject({
      c
    });
  });

  it('should successfully convertToMap string', async () => {
    const d = 'test';

    // else
    const res = convertToMap([
      {
        name: {
          value: 'd'
        },
        value: {
          kind: 'String',
          value: d
        }
      }
    ]);
    expect(res).toMatchObject({
      d
    });
  });
});
