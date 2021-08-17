import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { createConnection } from 'graphql-sequelize';
import { supplierQueries } from './suppliers';
import { timestamps } from './timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { productQueries } from '@gql/models/products';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';

const { nodeInterface } = getNode();

export const supplierProductFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  supplierId: { type: GraphQLInt },
  productId: { type: GraphQLInt }
};
export const SupplierProduct = new GraphQLObjectType({
  name: 'SupplierProduct',
  interfaces: [nodeInterface],
  args: connectionArgs,
  fields: () => ({
    ...supplierProductFields,
    ...timestamps,
    products: {
      ...productQueries.list,
      resolve: (source, args, context, info) =>
        productQueries.list.resolve(source, args, { ...context, supplierProduct: source.dataValues }, info)
    },
    suppliers: {
      ...supplierQueries.list,
      resolve: (source, args, context, info) =>
        supplierQueries.list.resolve(source, args, { ...context, supplierProduct: source.dataValues }, info)
    }
  })
});

export const SupplierProductConnection = createConnection({
  nodeType: SupplierProduct,
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
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: SupplierProduct
  },
  list: {
    ...SupplierProductConnection,
    type: SupplierProductConnection.connectionType,
    args: SupplierProductConnection.connectionArgs
  },
  model: db.supplierProducts
};

export const supplierProductMutations = {
  args: supplierProductFields,
  type: SupplierProduct,
  model: db.supplierProducts
};
