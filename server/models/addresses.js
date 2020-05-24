import * as graphql from 'graphql';
import {
    connectionDefinitions,
    forwardConnectionArgs,
    connectionFromArray
} from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { StoreConnection } from './stores';
import { SupplierConnection } from './suppliers';
import { timestamps } from './timestamps';

const Address = new graphql.GraphQLObjectType({
    name: 'Address',
    interface: [nodeInterface],
    args: forwardConnectionArgs,
    sqlPaginate: true,
    orderBy: {
        created_at: 'desc',
        id: 'asc'
    },
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        address_1: { type: graphql.GraphQLString },
        address_2: { type: graphql.GraphQLString },
        city: { type: graphql.GraphQLString },
        country: { type: graphql.GraphQLString },
        lat: {
            type: graphql.GraphQLNonNull(graphql.GraphQLFloat)
        },
        long: {
            type: graphql.GraphQLNonNull(graphql.GraphQLFloat)
        },
        ...timestamps,
        suppliers: {
            type: SupplierConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlJoin: (addressTable, supplierTable, args) =>
                `${addressTable}.id = ${supplierTable}.address_id`,
            resolve: (address, args) =>
                connectionFromArray(address.suppliers, args)
        },
        stores: {
            type: StoreConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlJoin: (addressTable, storeTable, args) =>
                `${addressTable}.id = ${storeTable}.address_id`,
            resolve: (address, args) =>
                connectionFromArray(address.stores, args)
        }
    })
});
Address._typeConfig = {
    sqlTable: 'addresses',
    uniqueKey: 'id'
};

const { connectionType: AddressConnection } = connectionDefinitions({
    nodeType: Address,
    connectionFields: {
        total: {
            type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
    }
});

export { AddressConnection, Address };
