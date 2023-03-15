import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { supplierLists } from '../suppliers';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { storeLists } from '@gql/models/stores';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();
export const addressFields = {
  id: { type: new GraphQLNonNull(GraphQLID) },
  address1: {
    type: GraphQLString,
    extensions: ['@uppercase', 'uppercase'],
    resolve: (source, args, context, info) => source.address1
  },
  address2: { type: GraphQLString },
  city: { type: GraphQLString },
  country: { type: GraphQLString },
  latitude: {
    type: new GraphQLNonNull(GraphQLFloat)
  },
  longitude: {
    type: new GraphQLNonNull(GraphQLFloat)
  }
};
const GraphQLAddress = new GraphQLObjectType({
  name: 'Address',
  interfaces: [nodeInterface],
  sqlPaginate: true,
  orderBy: {
    created_at: 'desc',
    id: 'asc'
  },
  fields: () => ({
    ...getQueryFields(addressFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    suppliers: {
      ...supplierLists.list,
      resolve: (source, args, context, info) =>
        supplierLists.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    },
    stores: {
      ...storeLists.list,
      resolve: (source, args, context, info) =>
        storeLists.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    }
  })
});

const AddressConnection = createConnection({
  name: 'addresses',
  target: db.addresses,
  nodeType: GraphQLAddress,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.supplier?.id) {
      findOptions.include.push({
        model: db.suppliers,
        where: {
          id: context.supplier.id
        }
      });
    }

    if (context?.store?.id) {
      findOptions.include.push({
        model: db.stores,
        where: {
          id: context.store.id
        }
      });
    }
    return findOptions;
  },
  ...totalConnectionFields
});

export { AddressConnection, GraphQLAddress };

// queries on the address table
export const addressQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLAddress
  },
  model: db.addresses
};

// lists on the address table.
export const addressLists = {
  list: {
    ...AddressConnection,
    resolve: AddressConnection.resolve,
    type: AddressConnection.connectionType,
    args: AddressConnection.connectionArgs
  },
  model: db.addresses
};

export const addressMutations = {
  args: addressFields,
  type: GraphQLAddress,
  model: db.addresses
};
