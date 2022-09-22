import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import { defaultListArgs, defaultArgs, resolver } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { getGqlModels } from '@server/utils/autogenHelper';
import { QUERY_TYPE } from '@server/utils/constants';

const shouldAddQuery = (type, table) => {
  if (type === QUERY_TYPE.CUSTOM) {
    const negateTablesList = ['books'];
    return !negateTablesList.includes(table);
  }
};

const { nodeField, nodeTypeMapper } = getNode();
const DB_TABLES = getGqlModels({ type: 'Queries', blacklist: ['aggregate', 'timestamps'] });

console.log('db tables', DB_TABLES);

export const addQueries = () => {
  const query = {};
  Object.keys(DB_TABLES).forEach(table => {
    query[camelCase(table)] = {
      ...DB_TABLES[table].query,
      resolve: resolver(DB_TABLES[table].model),
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        ...DB_TABLES[table].args,
        ...defaultArgs(DB_TABLES[table].model)
      }
    };

    if (shouldAddQuery(QUERY_TYPE.CUSTOM, table)) {
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
    }
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
