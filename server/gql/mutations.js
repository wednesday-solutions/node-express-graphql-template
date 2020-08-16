import { GraphQLNonNull, GraphQLObjectType, GraphQLInt } from 'graphql';
import camelCase from 'lodash/camelCase';
import { Product, productFields } from 'gql/models/products';
import { PurchasedProduct, purchasedProductFields } from 'gql/models/purchasedProducts';
import { Address, addressFields } from 'gql/models/addresses';
import { StoreProduct, storeProductFields } from 'gql/models/storeProducts';
import { Store, storeFields } from 'gql/models/stores';
import { Supplier, supplierFields } from 'gql/models/suppliers';
import { SupplierProduct, supplierProductFields } from 'gql/models/supplierProducts';
import {
  products as productsModel,
  purchased_products as purchasedProductsModel,
  addresses as addressesModel,
  store_products as storeProductsModel,
  stores as storesModel,
  supplier_products as supplerProductsModel,
  suppliers as suppliersModel
} from 'database/models';
import { DeletedId, deleteUsingId, updateUsingId } from 'database/dbUtils';

export const createResolvers = model => ({
  createResolver: (parent, args, context, resolveInfo) => model.create(args),
  updateResolver: (parent, args, context, resolveInfo) => updateUsingId(model, args),
  deleteResolver: (parent, args, context, resolveInfo) => deleteUsingId(model, args)
});
export const DB_TABLES = {
  Product: {
    table: Product,
    args: productFields,
    ...createResolvers(productsModel)
  },
  PurchasedProduct: {
    table: PurchasedProduct,
    args: purchasedProductFields,
    ...createResolvers(purchasedProductsModel)
  },
  Address: {
    table: Address,
    args: addressFields,
    ...createResolvers(addressesModel)
  },
  StoreProduct: {
    table: StoreProduct,
    args: storeProductFields,
    ...createResolvers(storeProductsModel)
  },
  Store: {
    table: Store,
    args: storeFields,
    ...createResolvers(storesModel)
  },
  Supplier: {
    table: Supplier,
    args: supplierFields,
    ...createResolvers(suppliersModel)
  },
  SupplierProduct: {
    table: SupplierProduct,
    args: supplierProductFields,
    ...createResolvers(supplerProductsModel)
  }
};

export const addMutations = () => {
  const mutations = {};

  Object.keys(DB_TABLES).forEach(table => {
    mutations[camelCase(`create${table}`)] = {
      type: DB_TABLES[table].table,
      args: DB_TABLES[table].args,
      resolve: DB_TABLES[table].createResolver
    };
    mutations[camelCase(`update${table}`)] = {
      type: DB_TABLES[table].table,
      args: {
        ...DB_TABLES[table].args,
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: DB_TABLES[table].updateResolver
    };
    mutations[camelCase(`delete${table}`)] = {
      type: DeletedId,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: DB_TABLES[table].deleteResolver
    };
  });
  return mutations;
};

export const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...addMutations()
  })
});
