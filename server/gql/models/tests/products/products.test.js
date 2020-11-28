import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '../../../queries';
import { MutationRoot } from '../../../mutations';
import { timestamps } from '@gql/models/timestamps';
import { productFields } from '@gql/models/products';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...productFields, ...timestamps });

const query = `
  {
    __type(name: "Product") {
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
describe('Product introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const productFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(productFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
  it('should have a supplier connection', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressFieldTypes = get(result, 'data.__type.fields');
    const supplierField = addressFieldTypes.find(field => field.name === 'suppliers');
    expect(supplierField.type.kind).toBe('OBJECT');
    expect(supplierField.type.name).toBe('suppliersConnection');
  });
  it('should have a store connection', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressFieldTypes = get(result, 'data.__type.fields');
    const storeField = addressFieldTypes.find(field => field.name === 'stores');
    expect(storeField.type.kind).toBe('OBJECT');
    expect(storeField.type.name).toBe('storeConnection');
  });
});
