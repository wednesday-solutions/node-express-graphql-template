import { GraphQLFloat, GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'gql/node';
import { StoreConnection } from './stores';
import { SupplierConnection } from './suppliers';
import { timestamps } from './timestamps';

export const addressFields = {
  id: { type: GraphQLInt },
  address1: { sqlColumn: 'address_1', type: GraphQLString },
  address2: { sqlColumn: 'address_2', type: GraphQLString },
  city: { type: GraphQLString },
  country: { type: GraphQLString },
  lat: {
    type: GraphQLNonNull(GraphQLFloat)
  },
  long: {
    type: GraphQLNonNull(GraphQLFloat)
  }
};
const Address = new GraphQLObjectType({
  name: 'Address',
  interface: [nodeInterface],
  args: forwardConnectionArgs,
  sqlPaginate: true,
  orderBy: {
    created_at: 'desc',
    id: 'asc'
  },
  fields: () => ({
    ...addressFields,
    ...timestamps,
    suppliers: {
      type: SupplierConnection,
      args: forwardConnectionArgs,
      sqlPaginate: true,
      orderBy: 'id',
      sqlJoin: (addressTable, supplierTable, args) => `${addressTable}.id = ${supplierTable}.address_id`
    },
    stores: {
      type: StoreConnection,
      args: forwardConnectionArgs,
      sqlPaginate: true,
      orderBy: 'id',
      sqlJoin: (addressTable, storeTable, args) => `${addressTable}.id = ${storeTable}.address_id`
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
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { AddressConnection, Address };
