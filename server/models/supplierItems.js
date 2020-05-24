import * as graphql from 'graphql';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Item } from './items';
import { Supplier } from './suppliers';
import { timestamps } from './timestamps';

const SupplierItem = new graphql.GraphQLObjectType({
    name: 'SupplierItem',
    interface: [nodeInterface],
    args: connectionArgs,
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        supplier_id: { type: graphql.GraphQLInt },
        item_id: { type: graphql.GraphQLInt },
        ...timestamps,
        item: {
            type: Item,
            sqlJoin: (supplierItemsTable, itemTable, args) =>
                `${itemTable}.id = ${supplierItemsTable}.item_id`
        },
        supplier: {
            type: Supplier,
            sqlJoin: (supplierItemsTable, supplierTable, args) =>
                `${supplierTable}.id = ${supplierItemsTable}.supplier_id`
        }
    })
});

SupplierItem._typeConfig = {
    sqlTable: 'supplier_items',
    uniqueKey: 'id'
};

const { connectionType: SupplierItemConnection } = connectionDefinitions({
    nodeType: SupplierItem,
    connectionFields: {
        total: {
            type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
    }
});

export { SupplierItem, SupplierItemConnection };
