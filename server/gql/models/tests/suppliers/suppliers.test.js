import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { createRootQuery } from '@gql/queries';
import { createRootMutation } from '@gql/mutations';
import { timestamps } from '@gql/models/timestamps';
import { supplierFields } from '@gql/models/suppliers';
let schema = null;

let fields = [];

beforeAll(async () => {
  const query = await createRootQuery();
  const mutation = await createRootMutation();
  schema = new GraphQLSchema({ query, mutation });
  fields = createFieldsWithType({ ...supplierFields, ...timestamps });
});

const query = `
  {
    __type(name: "Supplier") {
        name
        kind
        fields {
          name
          type {
            name
            kind
          }
        }
      }    
  }
`;
describe('Supplier introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const supplierFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(supplierFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
  it('should have a store connection', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressFieldTypes = get(result, 'data.__type.fields');
    const storeField = addressFieldTypes.find(field => field.name === 'products');
    expect(storeField.type.kind).toBe('OBJECT');
    expect(storeField.type.name).toBe('productsConnection');
  });
});
