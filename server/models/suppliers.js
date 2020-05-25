import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
} from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Address } from './addresses';
import { SupplierItemConnection } from './supplierItems';
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
            sqlJoin: (storeTable, addressTable, args) =>
                `${addressTable}.id = ${storeTable}.address_id`
        },
        items: {
            type: SupplierItemConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlJoin: (storeTable, supplierItemTable, args) =>
                `${storeTable}.id = ${supplierItemTable}.supplier_id`
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
