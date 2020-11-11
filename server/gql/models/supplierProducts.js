import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { createConnection } from 'graphql-sequelize';
import { supplierQueries } from './suppliers';
import { timestamps } from './timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { productQueries } from '@gql/models/products';

const { nodeInterface } = getNode();

export const supplierProductFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  supplierId: { sqlColumn: 'supplier_id', type: GraphQLInt },
  productId: { sqlColumn: 'product_id', type: GraphQLInt }
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

// queries on the product table
export const supplierProductQueries = {
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
