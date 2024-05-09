import { GraphQLInt, GraphQLNonNull } from 'graphql';
const description = 'Use with grapql-relay compliant queries';
export const customListArgs = {
  limit: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Use with offset to get paginated results with total'
  },
  offset: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Use with offset to get paginated results with total'
  },
  before: { type: GraphQLInt, description },
  after: { type: GraphQLInt, description },
  first: { type: GraphQLInt, description },
  last: { type: GraphQLInt, description }
};
