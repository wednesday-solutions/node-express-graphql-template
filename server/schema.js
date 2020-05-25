import { GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import joinMonster from 'join-monster';
import { client } from 'database';
import { Item, ItemConnection } from 'models/items';
import { PurchasedItem, PurchasedItemConnection } from 'models/purchasedItems';
import { Address, AddressConnection } from 'models/addresses';
import { StoreItem, StoreItemConnection } from 'models/storeItems';
import { Store, StoreConnection } from 'models/stores';
import { Supplier, SupplierConnection } from 'models/suppliers';
import { SupplierItem, SupplierItemConnection } from 'models/supplierItems';

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
    list: PurchasedItemConnection
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
      where: (t, args, context) => {
        if (CONNECTIONS[table].where) {
          return CONNECTIONS[table].where(t, args, context);
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
