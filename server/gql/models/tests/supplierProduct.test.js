import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from 'server/utils/testUtils';
import { QueryRoot } from '../../queries';
import { MutationRoot } from '../../mutations';
import { timestamps } from 'gql/models/timestamps';
import { supplierProductFields } from 'gql/models/supplierProducts';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...supplierProductFields, ...timestamps });

const query = `
  {
    __type(name: "SupplierProduct") {
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
describe('Supplier Product introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const supplierProductFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(supplierProductFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });

  it('should have a product field of type Product', async () => {
    const result = await graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, 'data.__type.fields');
    const productField = purchasedProductFieldTypes.find(field => field.name === 'product');
    expect(productField.type.name).toBe('Product');
    expect(productField.type.kind).toBe('OBJECT');
  });

  it('should have a supplier field of type Supplier', async () => {
    const result = await graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, 'data.__type.fields');
    const productField = purchasedProductFieldTypes.find(field => field.name === 'supplier');
    expect(productField.type.name).toBe('Supplier');
    expect(productField.type.kind).toBe('OBJECT');
  });
});
