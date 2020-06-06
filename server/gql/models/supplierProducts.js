import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import { nodeInterface } from 'gql/node';
import { Product } from './products';
import { Supplier } from './suppliers';
import { timestamps } from './timestamps';

export const supplierProductFields = {
  id: { type: GraphQLInt },
  supplierId: { sqlColumn: 'supplier_id', type: GraphQLInt },
  productId: { sqlColumn: 'product_id', type: GraphQLInt }
};
const SupplierProduct = new GraphQLObjectType({
  name: 'SupplierProduct',
  interface: [nodeInterface],
  args: connectionArgs,
  fields: () => ({
    ...supplierProductFields,
    ...timestamps,
    product: {
      type: Product,
      sqlJoin: (supplierProductsTable, productTable, args) => `${productTable}.id = ${supplierProductsTable}.product_id`
    },
    supplier: {
      type: Supplier,
      sqlJoin: (supplierProductsTable, supplierTable, args) =>
        `${supplierTable}.id = ${supplierProductsTable}.supplier_id`
    }
  })
});

SupplierProduct._typeConfig = {
  sqlTable: 'supplier_products',
  uniqueKey: 'id'
};

const { connectionType: SupplierProductConnection } = connectionDefinitions({
  nodeType: SupplierProduct,
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { SupplierProduct, SupplierProductConnection };
