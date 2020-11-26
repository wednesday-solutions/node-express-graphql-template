import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from './products';
import { storeQueries } from './stores';
import { timestamps } from './timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';

const { nodeInterface } = getNode();

export const storeProductFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  productId: { type: GraphQLInt, sqlColumn: 'product_id' },
  storeId: { type: GraphQLInt, sqlColumn: 'store_id' }
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
  where: function(key, value, currentWhere) {
    // for custom args other than connectionArgs return a sequelize where parameter
    return { [key]: value };
  },
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
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
