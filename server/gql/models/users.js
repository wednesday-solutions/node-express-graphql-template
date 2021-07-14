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
  email: { type: GraphQLNonNull(GraphQLString) }
};

const User = new GraphQLObjectType({
  name: 'user',
  interfaces: [nodeInterface],
  fields: () => ({
    ...userFields,
    ...timestamps
  })
});

const UserConnection = createConnection({
  name: 'users',
  target: db.users,
  nodeType: User,
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
