import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '../../../queries';
import { MutationRoot } from '../../../mutations';
import { timestamps } from '@gql/fields/timestamps';
import { supplierProductFields } from '@gql/models/supplierProducts';

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
const fieldType = 'data.__type.fields';
describe('Supplier Product introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const supplierProductFieldTypes = get(result, fieldType);
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(supplierProductFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });

  it('should have a product field of type Product', async () => {
    const result = await graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, fieldType);
    const productField = purchasedProductFieldTypes.find(field => field.name === 'products');
    expect(productField.type.name).toBe('productsConnection');
    expect(productField.type.kind).toBe('OBJECT');
  });

  it('should have a supplier field of type Supplier', async () => {
    const result = await graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, fieldType);
    const supplierField = purchasedProductFieldTypes.find(field => field.name === 'suppliers');
    expect(supplierField.type.name).toBe('suppliersConnection');
    expect(supplierField.type.kind).toBe('OBJECT');
  });
});
