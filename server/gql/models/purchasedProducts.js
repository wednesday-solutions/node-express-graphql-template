import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from './products';
import { timestamps } from './timestamps';
import { GraphQLDateTime } from 'graphql-iso-date';
import { getNode } from '@gql/node';
import db from '@database/models';
import { sequelizedWhere } from '@database/dbUtils';
import { totalConnectionFields } from '@utils/index';

const { nodeInterface } = getNode();

export const purchasedProductFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  price: { type: GraphQLInt },
  discount: { type: GraphQLInt },
  deliveryDate: { type: GraphQLDateTime }
};
const PurchasedProduct = new GraphQLObjectType({
  name: 'PurchasedProduct',
  interfaces: [nodeInterface],
  fields: () => ({
    ...purchasedProductFields,
    ...timestamps,
    products: {
      ...productQueries.list,
      resolve: (source, args, context, info) =>
        productQueries.list.resolve(source, args, { ...context, purchasedProduct: source.dataValues }, info)
    }
  })
});

const PurchasedProductConnection = createConnection({
  name: 'purchasedProducts',
  target: db.purchasedProducts,
  nodeType: PurchasedProduct,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.purchasedProducts?.id) {
      findOptions.include.push({
        model: db.purchasedProducts,
        where: {
          id: context.purchasedProducts.id
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },

  ...totalConnectionFields
});

// queries on the purchasedProducts table
export const purchasedProductQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: PurchasedProduct
  },
  list: {
    ...PurchasedProductConnection,
    type: PurchasedProductConnection.connectionType,
    args: PurchasedProductConnection.connectionArgs
  },
  model: db.purchasedProducts
};

export const purchasedProductMutations = {
  args: purchasedProductFields,
  type: PurchasedProduct,
  model: db.purchasedProducts
};
