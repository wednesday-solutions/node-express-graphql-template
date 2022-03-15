import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from '../products';
import { timestamps } from '../timestamps';
import { GraphQLDateTime } from 'graphql-iso-date';
import { getNode } from '@gql/node';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import customCreateResolver from './customCreateResolver';
import { getQueryFields, CREATE_AND_QUERY_REQUIRED_ARGS, TYPE_ATTRIBUTES } from '@utils/gqlFieldUtils';
const { nodeInterface } = getNode();

export const purchasedProductFields = {
  id: { type: GraphQLID, ...CREATE_AND_QUERY_REQUIRED_ARGS },
  price: { type: GraphQLInt, ...CREATE_AND_QUERY_REQUIRED_ARGS },
  discount: { type: GraphQLInt, ...CREATE_AND_QUERY_REQUIRED_ARGS },
  deliveryDate: { type: GraphQLDateTime, [TYPE_ATTRIBUTES.isUpdateRequired]: true, ...CREATE_AND_QUERY_REQUIRED_ARGS },
  productId: { type: GraphQLID, ...CREATE_AND_QUERY_REQUIRED_ARGS },
  storeId: { type: GraphQLID, ...CREATE_AND_QUERY_REQUIRED_ARGS }
};
const PurchasedProduct = new GraphQLObjectType({
  name: 'PurchasedProduct',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(purchasedProductFields, TYPE_ATTRIBUTES.isNonNull),
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
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  nodeType: PurchasedProduct,
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
  model: db.purchasedProducts,
  customCreateResolver
};
