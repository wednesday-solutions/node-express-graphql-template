import * as graphql from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Item } from './items';
import { Store } from './stores';
import { timestamps } from './timestamps';

const StoreItem = new graphql.GraphQLObjectType({
    name: 'StoreItem',
    interface: [nodeInterface],
    args: forwardConnectionArgs,
    sqlPaginate: true,
    orderBy: {
        created_at: 'desc',
        id: 'asc'
    },
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        ...timestamps,
        item: {
            type: Item,
            sqlJoin: (storeItemsTable, itemTable, args) =>
                `${itemTable}.id = ${storeItemsTable}.item_id`
        },
        store: {
            type: Store,
            sqlJoin: (storeItemsTable, storeTable, args) =>
                `${storeTable}.id = ${storeItemsTable}.store_id`
        }
    })
});

StoreItem._typeConfig = {
    sqlTable: 'store_items',
    uniqueKey: 'id'
};

const { connectionType: StoreItemConnection } = connectionDefinitions({
    nodeType: StoreItem,
    connectionFields: {
        total: {
            type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
    }
});

export { StoreItem, StoreItemConnection };
