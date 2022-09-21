import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import { defaultListArgs, defaultArgs, resolver } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { getGqlModels } from '@server/utils/autogenHelper';

const { nodeField, nodeTypeMapper } = getNode();
const DB_TABLES = getGqlModels({ type: 'Queries', blacklist: ['aggregate', 'timestamps'] });

export const createResolvers = (table, model, customResolver) => ({
  customResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : resolver(DB_TABLES[table].model)
});

export const addQueries = () => {
  const query = {};
  Object.keys(DB_TABLES).forEach(table => {
    query[camelCase(table)] = {
      ...DB_TABLES[table].query,
      // resolve: resolver(DB_TABLES[table].model),
      resolve: createResolvers(table, DB_TABLES[table].model, DB_TABLES[table].customQueryResolver).customResolver,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        ...DB_TABLES[table].args,
        ...defaultArgs(DB_TABLES[table].model)
      }
    };
    query[pluralize(camelCase(table))] = {
      ...DB_TABLES[table].list,
      args: {
        ...DB_TABLES[table].list?.args,
        ...defaultListArgs(DB_TABLES[table].model),
        limit: { type: GraphQLInt, description: 'Use with offset to get paginated results with total' },
        offset: { type: GraphQLInt, description: 'Use with limit to get paginated results with total' },
        before: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
        after: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
        first: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
        last: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' }
      }
    };
  });
  return query;
};

nodeTypeMapper.mapTypes({});
export const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  node: nodeField,
  fields: () => ({
    ...addQueries()
  })
});
