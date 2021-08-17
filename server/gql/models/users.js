import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from './timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';

const { nodeInterface } = getNode();

export const userFields = {
  firstName: { type: GraphQLNonNull(GraphQLString) },
  lastName: { type: GraphQLNonNull(GraphQLString) }
};

const User = new GraphQLObjectType({
  name: 'user',
  interfaces: [nodeInterface],
  fields: () => ({
    ...userFields,
    id: { type: GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLNonNull(GraphQLString) },
    ...timestamps
  })
});

const UserConnection = createConnection({
  name: 'users',
  target: db.users,
  nodeType: User,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
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
