import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';

import { nodeInterface } from 'server/node';
import { SupplierConnection } from './suppliers';
import { StoreConnection } from './stores';
import { timestamps } from './timestamps';

const Item = new GraphQLObjectType({
  name: 'Item',
  description: 'items on sale',
  sqlTable: 'items',
  uniqueKey: 'id',
  interface: [nodeInterface],
  sqlPaginate: true,
  orderBy: 'id',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    amount: { type: GraphQLInt },
    ...timestamps,
    suppliers: {
      type: SupplierConnection,
      sqlPaginate: true,
      orderBy: 'id',
      args: forwardConnectionArgs,
      junction: {
        sqlTable: 'supplier_items',
        sqlJoins: [
          (itemsTable, junctionTable, args) => `${itemsTable}.id = ${junctionTable}.item_id`,
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
        sqlTable: 'store_items',
        sqlJoins: [
          (itemsTable, junctionTable, args) => `${itemsTable}.id = ${junctionTable}.item_id`,
          (junctionTable, storeTable, args) => `${storeTable}.id = ${junctionTable}.store_id`
        ]
      }
    }
  })
});

Item._typeConfig = {
  sqlTable: 'items',
  uniqueKey: 'id'
};

const { connectionType: ItemConnection } = connectionDefinitions({
  nodeType: Item,
  name: 'item',
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { Item, ItemConnection };
