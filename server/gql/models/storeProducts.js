import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from './products';
import { storeQueries } from './stores';
import { timestamps } from './timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { totalConnectionFields, getQueryFields, REQUIRED_ARGS } from '@utils/index';
import { TYPE_ATTRIBUTES } from '@utils/constants';

const { nodeInterface } = getNode();

export const storeProductFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  productId: { type: GraphQLInt, ...REQUIRED_ARGS },
  storeId: { type: GraphQLInt, ...REQUIRED_ARGS }
};
export const StoreProduct = new GraphQLObjectType({
  name: 'StoreProduct',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(storeProductFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    products: {
      ...productQueries.list,
      resolve: (source, args, context, info) =>
        productQueries.list.resolve(source, args, { ...context, storeProduct: source.dataValues }, info)
    },
    stores: {
      ...storeQueries.list,
      resolve: (source, args, context, info) =>
        storeQueries.list.resolve(source, args, { ...context, storeProduct: source.dataValues }, info)
    }
  })
});

export const StoreProductConnection = createConnection({
  nodeType: StoreProduct,
  name: 'storeProducts',
  target: db.storeProducts,

  ...totalConnectionFields
});

// queries on the storeProducts table
export const storeProductQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: StoreProduct
  },
  list: {
    ...StoreProductConnection,
    type: StoreProductConnection.connectionType,
    args: StoreProductConnection.connectionArgs
  },
  model: db.storeProducts
};

export const storeProductMutations = {
  args: storeProductFields,
  type: StoreProduct,
  model: db.storeProducts
};
