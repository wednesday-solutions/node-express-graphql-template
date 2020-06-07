import { GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import joinMonster from 'join-monster';
import { client } from 'database';
import { Aggregate } from 'gql/models/aggregate';
import { nodeField } from 'gql/node';
import { Product, ProductConnection } from 'gql/models/products';
import { PurchasedProduct, PurchasedProductConnection } from 'gql/models/purchasedProducts';
import { Address, AddressConnection } from 'gql/models/addresses';
import { StoreProduct, StoreProductConnection } from 'gql/models/storeProducts';
import { Store, StoreConnection } from 'gql/models/stores';
import { Supplier, SupplierConnection } from 'gql/models/suppliers';
import { SupplierProduct, SupplierProductConnection } from 'gql/models/supplierProducts';
import { addWhereClause } from 'utils';

export const DB_TABLES = {
  Product: {
    table: Product
  },
  PurchasedProduct: {
    table: PurchasedProduct
  },
  Address: {
    table: Address
  },
  StoreProduct: {
    table: StoreProduct
  },
  Store: {
    table: Store
  },
  Supplier: {
    table: Supplier,
    where: (t, args, context) => {
      let where = ``;
      if (args.productId) {
        where += `and ${t}.product_id=${args.productId}`;
      }
      return escape(`${t}.id=${args.id} ${where}`);
    },
    args: {
      productId: {
        type: GraphQLString
      }
    }
  },
  SupplierProduct: {
    table: SupplierProduct
  }
};

export const CONNECTIONS = {
  Product: {
    list: ProductConnection
  },
  PurchasedProduct: {
    list: PurchasedProductConnection,
    where: (t, args, context, aliases) => {
      if (Object.keys(args).length) {
        let where = `TRUE`;
        aliases.children.forEach(aliasTable => {
          if (aliasTable.name === 'products' && aliasTable.type === 'table') {
            if (args.category) {
              // get list of purchased products by category
              where = addWhereClause(where, `"product".category = '${args.category}'`);
            }
            aliasTable.children.forEach(alias => {
              if (alias.name === 'suppliers' && alias.type === 'table') {
                if (args.hasSupplier) {
                  // get list of purchased products which have a supplier
                  where = addWhereClause(where, `"supplier_products".id != 0`);
                } else if (args.supplierId) {
                  // get list of purchased products by supplierId
                  where = addWhereClause(where, `"supplier_products".supplier_id = ${args.supplierId}`);
                }
              }

              if (alias.name === 'stores' && alias.type === 'table') {
                if (args.hasStore) {
                  // get list of purchased products which have a store
                  where = addWhereClause(where, `"store_products".id != 0`);
                } else if (args.storeId) {
                  // get list of purchased products by storeId
                  where = addWhereClause(where, `"store_products".store_id = ${args.storeId}`);
                }
              }
            });
          }
          aliasTable.where = () => where;
        });
      }
    },
    args: {
      category: {
        type: GraphQLString
      },
      hasStore: { type: GraphQLBoolean },
      hasSupplier: { type: GraphQLBoolean },
      storeId: { type: GraphQLInt },
      supplierId: { type: GraphQLInt }
    }
  },
  Address: {
    list: AddressConnection
  },
  StoreProduct: {
    list: StoreProductConnection
  },
  Store: {
    list: StoreConnection
  },
  Supplier: {
    list: SupplierConnection
  },
  SupplierProduct: {
    list: SupplierProductConnection
  }
};

const options = { dialect: 'pg' };
export const addQueries = () => {
  const query = {};
  Object.keys(DB_TABLES).forEach(table => {
    query[camelCase(table)] = {
      type: DB_TABLES[table].table,
      args: {
        ...DB_TABLES[table].args,
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      where: (t, args, context, aliases) => {
        let where = `TRUE`;
        if (DB_TABLES[table].where) {
          where = DB_TABLES[table].where(t, args, context, aliases) || where;
        }
        where = addWhereClause(where, `${t}.id = ${args.id}`);
        where = addWhereClause(where, `${t}.deleted_at IS NULL `);
        return where;
      },
      resolve: (parent, args, context, resolveInfo) =>
        joinMonster(
          resolveInfo,
          {},
          async sql => {
            const result = await client.query(sql);
            if (result?.length > 0) {
              return result[1].rows;
            }
            return null;
          },
          options
        )
    };
    query[pluralize(camelCase(table))] = {
      type: CONNECTIONS[table].list,
      args: {
        first: {
          type: GraphQLInt
        },
        after: {
          type: GraphQLString
        },
        before: {
          type: GraphQLString
        },
        ...CONNECTIONS[table].args
      },
      where: (t, args, context, aliases) => {
        let where = `TRUE`;
        if (CONNECTIONS[table].where) {
          where = CONNECTIONS[table].where(t, args, context, aliases) || where;
        }
        where = addWhereClause(where, `${t}.deleted_at IS NULL `);
        return where;
      },
      sqlPaginate: true,
      orderBy: 'id',
      resolve: (parent, args, context, resolveInfo) =>
        joinMonster(
          resolveInfo,
          {},
          async sql => {
            const result = await client.query(sql);
            if (result?.length > 0) {
              return result[1].rows;
            }
            return null;
          },
          options
        )
    };
  });
  return query;
};

export const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    ...addQueries(),
    aggregate: Aggregate
  })
});
