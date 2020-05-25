import * as graphql from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Item } from './items';
import { timestamps } from './timestamps';
import { GraphQLDateTime } from 'graphql-iso-date';

const PurchasedItem = new graphql.GraphQLObjectType({
    name: 'PurchasedItem',
    interface: [nodeInterface],
    args: forwardConnectionArgs,
    sqlPaginate: true,
    orderBy: {
        created_at: 'desc',
        id: 'asc'
    },
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        price: { type: graphql.GraphQLInt },
        discount: { type: graphql.GraphQLInt },
        deliveryDate: { sqlColumn: 'delivery_date', type: GraphQLDateTime },
        ...timestamps,
        item: {
            type: Item,
            sqlJoin: (purchasedItemTable, itemTable, args) =>
                `${itemTable}.id = ${purchasedItemTable}.item_id`
        }
    })
});

PurchasedItem._typeConfig = {
    sqlTable: 'purchased_items',
    uniqueKey: 'id'
};

const { connectionType: PurchasedItemConnection } = connectionDefinitions({
    nodeType: PurchasedItem,
    connectionFields: {
        total: {
            type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
    }
});

export { PurchasedItem, PurchasedItemConnection };
