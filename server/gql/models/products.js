import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';

import { nodeInterface } from 'gql/node';
import { SupplierConnection } from './suppliers';
import { StoreConnection } from './stores';
import { timestamps } from './timestamps';

export const productFields = {
  id: { type: GraphQLInt },
  name: { type: GraphQLString },
  category: { type: GraphQLString },
  amount: { type: GraphQLInt }
};
const Product = new GraphQLObjectType({
  name: 'Product',
  description: 'products on sale',
  sqlTable: 'products',
  uniqueKey: 'id',
  interface: [nodeInterface],
  sqlPaginate: true,
  orderBy: 'id',
  fields: () => ({
    ...productFields,
    ...timestamps,
    suppliers: {
      type: SupplierConnection,
      sqlPaginate: true,
      orderBy: 'id',
      args: forwardConnectionArgs,
      junction: {
        sqlTable: 'supplier_products',
        sqlJoins: [
          (productsTable, junctionTable, args) => `${productsTable}.id = ${junctionTable}.product_id`,
          (junctionTable, supplierTable, args) => `${supplierTable}.id = ${junctionTable}.supplier_id`
        ]
      }
    },
    stores: {
      type: StoreConnection,
      sqlPaginate: true,
      orderBy: 'id',
      args: forwardConnectionArgs,
      junction: {
        sqlTable: 'store_products',
        sqlJoins: [
          (productsTable, junctionTable, args) => `${productsTable}.id = ${junctionTable}.product_id`,
          (junctionTable, storeTable, args) => `${storeTable}.id = ${junctionTable}.store_id`
        ]
      }
    }
  })
});

Product._typeConfig = {
  sqlTable: 'products',
  uniqueKey: 'id'
};

const { connectionType: ProductConnection } = connectionDefinitions({
  nodeType: Product,
  name: 'product',
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { Product, ProductConnection };
