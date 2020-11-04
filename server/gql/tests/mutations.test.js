import get from 'lodash/get';
import includes from 'lodash/includes';
import pluralize from 'pluralize';
import { graphql, GraphQLSchema } from 'graphql';

import { mutationRoot } from '../mutations';

const schema = new GraphQLSchema({ mutation: mutationRoot });
const allModels = ['address', 'product', 'purchasedProduct', 'storeProduct', 'store', 'supplierProduct', 'supplier'];

allModels.forEach(model => allModels.push(pluralize(model)));

describe('mutation tests', () => {
  it('should create queries for all the models', async () => {
    const source = `
    mutation {
      __schema {
        mutationType {
          fields {
            name
          }
        }
      }
    }
`;
    const result = await graphql({ schema, source });
    const mutationRoot = get(result, 'data.__schema.mutationType.fields', []);
    const allMutations = [];
    mutationRoot.forEach(mutation => allMutations.push(mutation.name));
    const hasModelWithoutmutation = allModels.some(model => !includes(allMutations, model));
    expect(hasModelWithoutmutation).toBeFalsy();
  });
});
