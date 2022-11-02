import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productLists } from '../products';
import { storeLists } from '../stores';
import { timestamps } from '@gql/fields/timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();

export const storeProductFields = {
  id: { type: new GraphQLNonNull(GraphQLID) },
  productId: { type: GraphQLInt },
  storeId: { type: GraphQLInt }
};
export const GraphQLStoreProduct = new GraphQLObjectType({
  name: 'StoreProduct',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(storeProductFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    products: {
      ...productLists.list,
      resolve: (source, args, context, info) =>
        productLists.list.resolve(source, args, { ...context, storeProduct: source.dataValues }, info)
    },
    stores: {
      ...storeLists.list,
      resolve: (source, args, context, info) =>
        storeLists.list.resolve(source, args, { ...context, storeProduct: source.dataValues }, info)
    }
  })
});

export const StoreProductConnection = createConnection({
  nodeType: GraphQLStoreProduct,
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
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLStoreProduct
  },
  model: db.storeProducts
};

// lists on the storeProducts table
export const storeProductLists = {
  list: {
    ...StoreProductConnection,
    type: StoreProductConnection.connectionType,
    args: StoreProductConnection.connectionArgs
  },
  model: db.storeProducts
};

export const storeProductMutations = {
  args: storeProductFields,
  type: GraphQLStoreProduct,
  model: db.storeProducts
};
