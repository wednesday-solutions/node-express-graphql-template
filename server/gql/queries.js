import pluralize from 'pluralize';
import camelCase from 'lodash/camelCase';
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { defaultListArgs, defaultArgs, resolver } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { Product } from '@gql/models/products';
import { Aggregate } from '@gql/models/aggregate';
import { GRAPHQL_MODEL_EXCLUDES } from '@utils/constants';
import { getFileNames, createModelGetter } from '@utils';

const { nodeField, nodeTypeMapper } = getNode();

const getModelQueries = async dir => {
  const tables = {};
  const setQueries = createModelGetter({ append: 'Queries', tables });
  const models = getFileNames(dir, GRAPHQL_MODEL_EXCLUDES);
  const importModels = async (fileName, callback) => {
    const modelPath = `${'./models'}/${fileName}`;
    const model = await import(`${modelPath}`);
    if (fileName && model) {
      callback(fileName, model);
    } else {
      throw new Error('Missing Params');
    }
  };
  await Promise.all(models.map(modelName => importModels(modelName, setQueries)));
  return tables;
};

export const addQueries = async () => {
  const query = {
    aggregate: Aggregate
  };
  const DB_TABLES = await getModelQueries('./server/gql/models');

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
    query[pluralize(camelCase(table))] = {
      ...DB_TABLES[table].list,
      args: { ...DB_TABLES[table].list?.args, ...defaultListArgs(DB_TABLES[table].model) }
    };
  });
  return query;
};

nodeTypeMapper.mapTypes({
  products: Product
});

export const createRootQuery = async () => {
  const queries = await addQueries();
  return new GraphQLObjectType({
    name: 'Query',
    node: nodeField,
    fields: () => ({
      ...queries,
      aggregate: Aggregate
    })
  });
};
