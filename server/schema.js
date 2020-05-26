import { GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import joinMonster from 'join-monster';
import { client } from 'database';
import isEmpty from 'lodash/isEmpty';
import { Item, ItemConnection } from 'models/items';
import { PurchasedItem, PurchasedItemConnection } from 'models/purchasedItems';
import { Address, AddressConnection } from 'models/addresses';
import { StoreItem, StoreItemConnection } from 'models/storeItems';
import { Store, StoreConnection } from 'models/stores';
import { Supplier, SupplierConnection } from 'models/suppliers';
import { SupplierItem, SupplierItemConnection } from 'models/supplierItems';
import { addWhereClause } from 'utils';

const DB_TABLES = {
  Item: {
    table: Item
  },
  PurchasedItem: {
    table: PurchasedItem
  },
  Address: {
    table: Address
  },
  StoreItem: {
    table: StoreItem
  },
  Store: {
    table: Store
  },
  Supplier: {
    table: Supplier,
    where: (t, args, context) => {
      let where = ``;
      if (args.itemId) {
        where += `and ${t}.item_id=${args.itemId}`;
      }
      return escape(`${t}.id=${args.id} ${where}`);
    },
    args: {
      itemId: {
        type: GraphQLString
      }
    }
  },
  SupplierItem: {
    table: SupplierItem
  }
};

const CONNECTIONS = {
  Item: {
    list: ItemConnection
  },
  PurchasedItem: {
    list: PurchasedItemConnection,
    where: (t, args, context, aliases) => {
      if (Object.keys(args).length) {
        let where = `TRUE`;
        aliases.children.forEach(aliasTable => {
          if (aliasTable.name === 'items' && aliasTable.type === 'table') {
            if (args.category) {
              // get list of purchased items by category
              where = addWhereClause(where, `"item".category = '${args.category}'`);
            }
            aliasTable.children.forEach(alias => {
              if (alias.name === 'suppliers' && alias.type === 'table') {
                if (args.hasSupplier) {
                  // get list of purchased items which have a supplier
                  where = addWhereClause(where, `"supplier_items".id != 0`);
                } else if (args.supplierId) {
                  // get list of purchased items by supplierId
                  where = addWhereClause(where, `"supplier_items".id = ${args.supplierId}`);
                }
              }

              if (alias.name === 'stores' && alias.type === 'table') {
                if (args.hasStore) {
                  // get list of purchased items which have a store
                  where = addWhereClause(where, `"store_items".id != 0`);
                } else if (args.storeId) {
                  // get list of purchased items by storeId
                  where = addWhereClause(where, `"store_items".id = ${args.storeId}`);
                }
              }
            });
          }
          if (!isEmpty(where)) {
            aliasTable.where = () => where;
          }
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
  StoreItem: {
    list: StoreItemConnection
  },
  Store: {
    list: StoreConnection
  },
  Supplier: {
    list: SupplierConnection,
    where: (t, args, context, aliases) => {
      const where = ``;
      if (args.itemId) {
        // where +=`${t}.item_id = ${args.itemId}`
      }
      return `${where}`;
    },
    args: {
      itemId: {
        type: GraphQLInt
      }
    }
  },
  SupplierItem: {
    list: SupplierItemConnection
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
        if (DB_TABLES[table].where) {
          return DB_TABLES[table].where(t, args, context, aliases);
        }
        return `${t}.id = ${args.id}`;
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
        if (CONNECTIONS[table].where) {
          return CONNECTIONS[table].where(t, args, context, aliases);
        }
        return ``;
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
