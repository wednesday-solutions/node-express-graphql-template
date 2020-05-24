import * as graphql from 'graphql';
import {
    connectionDefinitions,
    connectionFromArray,
    forwardConnectionArgs
} from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Address } from './addresses';
import { SupplierItemConnection } from './supplierItems';
import { timestamps } from './timestamps';

const Supplier = new graphql.GraphQLObjectType({
    name: 'Supplier',
    interface: [nodeInterface],
    args: forwardConnectionArgs,
    sqlPaginate: true,
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
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
                `${storeTable}.id = ${supplierItemTable}.supplier_id`,
            resolve: (supplier, args) =>
                connectionFromArray(supplier.items, args)
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
            type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
    }
});

export { Supplier, SupplierConnection };
