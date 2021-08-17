import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from './products';
import { storeQueries } from './stores';
import { timestamps } from './timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';

const { nodeInterface } = getNode();

export const storeProductFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  productId: { type: GraphQLInt },
  storeId: { type: GraphQLInt }
};
export const StoreProduct = new GraphQLObjectType({
  name: 'StoreProduct',
  interfaces: [nodeInterface],
  fields: () => ({
    ...storeProductFields,
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
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
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
