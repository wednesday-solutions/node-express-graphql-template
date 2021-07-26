import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils/index';
import { createRootQuery } from '@gql/queries';
import { createRootMutation } from '@gql/mutations';
import { timestamps } from '@gql/models/timestamps';
import { purchasedProductFields } from '@gql/models/purchasedProducts';

let schema = null;

let fields = [];

beforeAll(async () => {
  const query = await createRootQuery();
  const mutation = await createRootMutation();
  schema = new GraphQLSchema({ query, mutation });
  fields = createFieldsWithType({ ...purchasedProductFields, ...timestamps });
});

const query = `
  {
    __type(name: "PurchasedProduct") {
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
describe('Purchased Product introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(purchasedProductFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });

  it('should have a product field of type Product', async () => {
    const result = graphqlSync({ schema, source: query });
    const purchasedProductFieldTypes = get(result, 'data.__type.fields');
    const productField = purchasedProductFieldTypes.find(field => field.name === 'products');
    expect(productField.type.name).toBe('productsConnection');
    expect(productField.type.kind).toBe('OBJECT');
  });
});
