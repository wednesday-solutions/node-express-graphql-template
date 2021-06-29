import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';

const { nodeInterface } = getNode();

export const userFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  firstName: { type: GraphQLNonNull(GraphQLString) },
  lastName: { type: GraphQLNonNull(GraphQLString) },
  email: { type: GraphQLNonNull(GraphQLString) },
  password: { type: GraphQLNonNull(GraphQLString) }
};

const User = new GraphQLObjectType({
  name: 'user',
  interfaces: [nodeInterface],
  sqlPaginate: true,
  orderBy: {
    created_at: 'desc',
    id: 'asc'
  },
  fields: () => ({
    ...userFields,
    ...timestamps
  })
});

const UserConnection = createConnection({
  name: 'users',
  target: db.users,
  nodeType: User,
  // before: (findOptions, args, context) => {
  //   // findOptions.include = findOptions.include || [];
  //   // if (context?.supplier?.id) {
  //   //   findOptions.include.push({
  //   //     model: db.suppliers,
  //   //     where: {
  //   //       id: context.supplier.id
  //   //     }
  //   //   });
  //   // }

  //   // if (context?.store?.id) {
  //   //   findOptions.include.push({
  //   //     model: db.stores,
  //   //     where: {
  //   //       id: context.store.id
  //   //     }
  //   //   });
  //   // }
  //   return findOptions;
  // },
  ...totalConnectionFields
});

export { User };

export const userQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: User
  },
  list: {
    ...UserConnection,
    resolve: UserConnection.resolve,
    type: UserConnection.connectionType,
    args: UserConnection.connectionArgs
  },
  model: db.users
};

export const userMutations = {
  args: userFields,
  type: User,
  model: db.users
};
