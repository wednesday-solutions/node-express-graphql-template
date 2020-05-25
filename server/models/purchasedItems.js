import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Item } from './items';
import { timestamps } from './timestamps';
import { GraphQLDateTime } from 'graphql-iso-date';

const PurchasedItem = new GraphQLObjectType({
    name: 'PurchasedItem',
    interface: [nodeInterface],
    args: forwardConnectionArgs,
    sqlPaginate: true,
    orderBy: {
        created_at: 'desc',
        id: 'asc'
    },
    fields: () => ({
        id: { type: GraphQLInt },
        price: { type: GraphQLInt },
        discount: { type: GraphQLInt },
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
            type: GraphQLNonNull(GraphQLInt)
        }
    }
});

export { PurchasedItem, PurchasedItemConnection };
