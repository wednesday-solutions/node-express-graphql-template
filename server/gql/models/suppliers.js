import { GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'gql/node';
import { Address } from './addresses';
import { ProductConnection } from './products';
import { timestamps } from './timestamps';

export const supplierFields = {
  id: { type: GraphQLInt },
  name: { type: GraphQLString },
  addressId: { sqlColumn: 'address_id', type: GraphQLInt }
};
const Supplier = new GraphQLObjectType({
  name: 'Supplier',
  interface: [nodeInterface],
  args: forwardConnectionArgs,
  sqlPaginate: true,
  fields: () => ({
    ...supplierFields,
    ...timestamps,
    address: {
      type: Address,
      sqlJoin: (supplierTable, addressTable, args) => `${addressTable}.id = ${supplierTable}.address_id`
    },
    products: {
      type: ProductConnection,
      sqlPaginate: true,
      orderBy: 'id',
      args: forwardConnectionArgs,
      junction: {
        sqlTable: 'supplier_products',
        sqlJoins: [
          (supplierTable, junctionTable, args) => `${supplierTable}.id = ${junctionTable}.supplier_id`,
          (junctionTable, productTable, args) => `${productTable}.id = ${junctionTable}.product_id`
        ]
      }
    }
  })
});

Supplier._typeConfig = {
  sqlTable: 'suppliers',
  uniqueKey: 'id'
};

const { connectionType: SupplierConnection } = connectionDefinitions({
  nodeType: Supplier,
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { Supplier, SupplierConnection };
