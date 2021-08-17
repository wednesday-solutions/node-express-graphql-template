import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from './products';
import { addressQueries } from './addresses';
import { timestamps } from './timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';

const { nodeInterface } = getNode();

export const storeFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  addressId: { type: GraphQLNonNull(GraphQLInt) }
};

export const Store = new GraphQLObjectType({
  name: 'Store',
  interfaces: [nodeInterface],
  fields: () => ({
    ...storeFields,
    ...timestamps,
    addresses: {
      ...addressQueries.list,
      resolve: (source, args, context, info) =>
        addressQueries.list.resolve(source, args, { ...context, store: source.dataValues }, info)
    },
    products: {
      ...productQueries.list,
      resolve: (source, args, context, info) =>
        productQueries.list.resolve(source, args, { ...context, store: source.dataValues }, info)
    }
  })
});

export const StoreConnection = createConnection({
  nodeType: Store,
  name: 'store',
  target: db.stores,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.product?.id) {
      findOptions.include.push({
        model: db.storeProducts,
        where: {
          productId: context.product.id
        }
      });
    }
    if (context?.address?.id) {
      findOptions.include.push({
        model: db.addresses,
        where: {
          id: context.address.id
        }
      });
    }

    if (context?.storeProduct?.storeId) {
      findOptions.include.push({
        model: db.storeProducts,
        where: {
          storeId: context.storeProduct.storeId
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the suppliers table
export const storeQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  query: {
    type: Store
  },
  list: {
    ...StoreConnection,
    type: StoreConnection.connectionType,
    args: StoreConnection.connectionArgs
  },
  model: db.stores
};

export const storeMutations = {
  args: storeFields,
  type: Store,
  model: db.stores
};
