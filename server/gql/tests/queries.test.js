import get from 'lodash/get';
import includes from 'lodash/includes';
import pluralize from 'pluralize';
import { graphql, GraphQLSchema } from 'graphql';

import { QueryRoot } from '../queries';
import { MutationRoot } from '../mutations';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });
const allModels = ['address', 'product', 'purchasedProduct', 'storeProduct', 'store', 'supplierProduct', 'supplier'];

allModels.forEach(model => allModels.push(pluralize(model)));

describe('query tests', () => {
  it('should create queries for all the models', async () => {
    const source = `
    query {
      __schema {
        queryType {
          fields {
            name
          }
        }
      }
    }
`;
    const result = await graphql({ schema, source });
    const queryRoot = get(result, 'data.__schema.queryType.fields', []);
    const allQueries = [];
    queryRoot.forEach(query => allQueries.push(query.name));
    const hasModelWithoutQuery = allModels.some(model => !includes(allQueries, model));
    expect(hasModelWithoutQuery).toBeFalsy();
  });
});
