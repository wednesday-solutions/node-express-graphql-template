import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '../../../queries';
import { MutationRoot } from '../../../mutations';
import { addressFields } from '@gql/models/addresses';
import { timestamps } from '@gql/models/timestamps';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...addressFields, ...timestamps });

const query = `
  {
    __type(name: "Address") {
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
describe('Address introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const addressFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(addressFieldTypes, fields);
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
