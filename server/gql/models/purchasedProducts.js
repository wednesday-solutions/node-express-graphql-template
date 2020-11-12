import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from './products';
import { timestamps } from './timestamps';
import { GraphQLDateTime } from 'graphql-iso-date';
import { getNode } from '@gql/node';
import db from '@database/models';

const { nodeInterface } = getNode();

export const purchasedProductFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  price: { type: GraphQLInt },
  discount: { type: GraphQLInt },
  deliveryDate: { sqlColumn: 'delivery_date', type: GraphQLDateTime }
};
const PurchasedProduct = new GraphQLObjectType({
  name: 'PurchasedProduct',
  interfaces: [nodeInterface],
  fields: () => ({
    ...purchasedProductFields,
    ...timestamps,
    product: {
      ...productQueries.list,
      resolve: (source, args, context, info) =>
        productQueries.list.resolve(source, args, { ...context, purchasedProduct: source.dataValues }, info)
    }
  })
});

const PurchasedProductConnection = createConnection({
  name: 'purchasedProducts',
  target: db.purchasedProducts,
  where: function(key, value, currentWhere) {
    // for custom args other than connectionArgs return a sequelize where parameter
    return { [key]: value };
  },
  nodeType: PurchasedProduct,
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
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
