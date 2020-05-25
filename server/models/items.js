import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString
} from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';

import { nodeInterface } from 'server/node';
import { StoreItemConnection } from './storeItems';
import { SupplierItemConnection } from './supplierItems';
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
        supplierItems: {
            description: 'A list of suppliers that have this item',
            type: SupplierItemConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlBatch: {
                thisKey: 'item_id',
                parentKey: 'id'
            }
        },
        storeItems: {
            type: StoreItemConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlJoin: (itemTable, storeItemsTable, args) =>
                `${itemTable}.id = ${storeItemsTable}.item_id`
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
