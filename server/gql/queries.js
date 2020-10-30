import { GraphQLObjectType } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import { defaultArgs, resolver } from 'graphql-sequelize';
import { Aggregate } from '@gql/models/aggregate';
import { getNode } from '@gql/node';
import { Product, productQueries } from '@gql/models/products';
import { addressQueries } from '@gql/models/addresses';
import { purchasedProductQueries } from '@gql/models/purchasedProducts';
import { storeProductQueries } from '@gql/models/storeProducts';
import { storeQueries } from '@gql/models/stores';
import { supplierQueries } from '@gql/models/suppliers';
import { supplierProductQueries } from '@gql/models/supplierProducts';

const { nodeField, nodeTypeMapper } = getNode();

const DB_TABLES = {
  product: productQueries,
  address: addressQueries,
  purchasedProduct: purchasedProductQueries,
  storeProduct: storeProductQueries,
  store: storeQueries,
  supplier: supplierQueries,
  supplierProduct: supplierProductQueries
};

export const addQueries = () => {
  const query = {
    aggregate: Aggregate
  };
  Object.keys(DB_TABLES).forEach(table => {
    query[camelCase(table)] = {
      ...DB_TABLES[table].query,
      resolve: resolver(DB_TABLES[table].model),
      args: {
        ...DB_TABLES[table].args,
        ...defaultArgs(DB_TABLES[table].model)
      }
    };
    query[pluralize(camelCase(table))] = {
      ...DB_TABLES[table].list
    };
  });
  return query;
};

nodeTypeMapper.mapTypes({
  products: Product
});
export const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  node: nodeField,
  fields: () => ({
    ...addQueries(),
    aggregate: Aggregate
  })
});
