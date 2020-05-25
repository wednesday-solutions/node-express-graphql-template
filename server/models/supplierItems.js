import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Item } from './items';
import { Supplier } from './suppliers';
import { timestamps } from './timestamps';

const SupplierItem = new GraphQLObjectType({
    name: 'SupplierItem',
    interface: [nodeInterface],
    args: connectionArgs,
    fields: () => ({
        id: { type: GraphQLInt },
        supplierId: { sqlColumn: 'supplier_id', type: GraphQLInt },
        itemId: { sqlColumn: 'item_id', type: GraphQLInt },
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
            type: GraphQLNonNull(GraphQLInt)
        }
    }
});

export { SupplierItem, SupplierItemConnection };
