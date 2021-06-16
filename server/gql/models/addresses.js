import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { supplierQueries } from './suppliers';
import { timestamps } from './timestamps';
import db from '@database/models';
import { storeQueries } from '@gql/models/stores';
import { totalConnectionFields } from '@utils/index';

const { nodeInterface } = getNode();
export const addressFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  address1: { type: GraphQLString },
  address2: { type: GraphQLString },
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
  interfaces: [nodeInterface],
  sqlPaginate: true,
  orderBy: {
    created_at: 'desc',
    id: 'asc'
  },
  fields: () => ({
    ...addressFields,
    ...timestamps,
    suppliers: {
      ...supplierQueries.list,
      resolve: (source, args, context, info) =>
        supplierQueries.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    },
    stores: {
      ...storeQueries.list,
      resolve: (source, args, context, info) =>
        storeQueries.list.resolve(source, args, { ...context, address: source.dataValues }, info)
    }
  })
});

const AddressConnection = createConnection({
  name: 'addresses',
  target: db.addresses,
  nodeType: Address,
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

export { AddressConnection, Address };

// queries on the address table
export const addressQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Address
  },
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
  type: Address,
  model: db.addresses
};
