import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
} from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Address } from './addresses';
import { ItemConnection } from './items';
import { timestamps } from './timestamps';

const Supplier = new GraphQLObjectType({
    name: 'Supplier',
    interface: [nodeInterface],
    args: forwardConnectionArgs,
    sqlPaginate: true,
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        ...timestamps,
        address: {
            type: Address,
            sqlJoin: (supplierTable, addressTable, args) =>
                `${addressTable}.id = ${supplierTable}.address_id`
        },
        items: {
            type: ItemConnection,
            sqlPaginate: true,
            orderBy: 'id',
            args: forwardConnectionArgs,
            junction: {
                sqlTable: 'supplier_items',
                sqlJoins: [
                    (supplierTable, junctionTable, args) =>
                        `${supplierTable}.id = ${junctionTable}.supplier_id`,
                    (junctionTable, itemTable, args) =>
                        `${itemTable}.id = ${junctionTable}.item_id`
                ]
            }
        }
    })
});

Supplier._typeConfig = {
    sqlTable: 'suppliers',
    uniqueKey: 'id'
};

const { connectionType: SupplierConnection } = connectionDefinitions({
    nodeType: Supplier,
    connectionFields: {
        total: {
            type: GraphQLNonNull(GraphQLInt)
        }
    }
});

export { Supplier, SupplierConnection };
