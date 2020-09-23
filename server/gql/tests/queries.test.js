import { graphql, GraphQLSchema } from 'graphql';

import { QueryRoot } from '../queries';
import { MutationRoot } from '../mutations';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

describe('query tests', async () => {
  const source = `
        query address(id: 1) {
          id
        }
    `;
  const result = await graphql({ schema, source });
  expect(result).to.deep.equal({
    data: {
      id: 1
    }
  });
});
