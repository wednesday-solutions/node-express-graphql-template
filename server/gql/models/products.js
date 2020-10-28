import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';

import { nodeInterface } from 'gql/node';
import { client } from 'database';
import { SupplierConnection } from './suppliers';
import { StoreConnection } from './stores';
import { timestamps } from './timestamps';

async function getProductSuppliers(args) {
  console.log({ args });
  const supplierProducts = await client.models.supplier_products.findAll({
    where: {
      product_id: args.id
    }
  });
  return supplierProducts.map(supplierProduct =>
    client.suppliers.findByPk({
      where: {
        id: supplierProduct.supplier_id
      }
    })
  );
}

async function getProductStores(args) {
  const supplierProducts = await client.models.store_products.findAll({
    where: {
      product_id: args.id
    }
  });
  return supplierProducts.map(supplierProduct =>
    client.suppliers.findByPk({
      where: {
        id: supplierProduct.supplier_id
      }
    })
  );
}

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
      resolve: (parent, args, context, resolveInfo) => {
        console.log({ args });
        return getProductSuppliers(args);
      }
    },
    stores: {
      type: StoreConnection,
      sqlPaginate: true,
      orderBy: 'id',
      args: forwardConnectionArgs,
      resolve: (parent, args, context, resolveInfo) => {
        console.log({ args });
        return getProductStores(args);
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
