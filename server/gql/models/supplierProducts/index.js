import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { createConnection } from 'graphql-sequelize';
import { supplierLists } from '../suppliers';
import { timestamps } from '@gql/fields/timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { productLists } from '@gql/models/products';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();

export const supplierProductFields = {
  id: { type: new GraphQLNonNull(GraphQLID) },
  supplierId: { type: GraphQLInt },
  productId: { type: GraphQLInt }
};
export const GraphQLSupplierProduct = new GraphQLObjectType({
  name: 'SupplierProduct',
  interfaces: [nodeInterface],
  args: connectionArgs,
  fields: () => ({
    ...getQueryFields(supplierProductFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    products: {
      ...productLists.list,
      resolve: (source, args, context, info) =>
        productLists.list.resolve(source, args, { ...context, supplierProduct: source.dataValues }, info)
    },
    suppliers: {
      ...supplierLists.list,
      resolve: (source, args, context, info) =>
        supplierLists.list.resolve(source, args, { ...context, supplierProduct: source.dataValues }, info)
    }
  })
});

export const SupplierProductConnection = createConnection({
  nodeType: GraphQLSupplierProduct,
  name: 'supplierProducts',
  target: db.supplierProducts,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the product table
export const supplierProductQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLSupplierProduct
  },
  model: db.supplierProducts
};

// lists on the product table
export const supplierProductLists = {
  list: {
    ...SupplierProductConnection,
    type: SupplierProductConnection.connectionType,
    args: SupplierProductConnection.connectionArgs
  },
  model: db.supplierProducts
};

export const supplierProductMutations = {
  args: supplierProductFields,
  type: GraphQLSupplierProduct,
  model: db.supplierProducts
};
