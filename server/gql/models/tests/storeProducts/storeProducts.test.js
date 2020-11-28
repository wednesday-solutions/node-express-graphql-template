import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '../../../queries';
import { MutationRoot } from '../../../mutations';
import { timestamps } from '@gql/models/timestamps';
import { storeProductFields } from '@gql/models/storeProducts';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...storeProductFields, ...timestamps });

const query = `
  {
    __type(name: "StoreProduct") {
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
describe('Store Product introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const storeProductFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(storeProductFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });

  it('should have a product field of type Product', async () => {
    const result = await graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, 'data.__type.fields');
    const productField = purchasedProductFieldTypes.find(field => field.name === 'products');
    expect(productField.type.name).toBe('productsConnection');
    expect(productField.type.kind).toBe('OBJECT');
  });

  it('should have a store field of type Store', async () => {
    const result = await graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, 'data.__type.fields');
    const productField = purchasedProductFieldTypes.find(field => field.name === 'stores');
    expect(productField.type.name).toBe('storeConnection');
    expect(productField.type.kind).toBe('OBJECT');
  });
});
