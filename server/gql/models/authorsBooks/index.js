import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@server/utils';
import { authorQueries } from '../authors';
import { sequelizedWhere } from '@server/database/dbUtils';

const { nodeInterface } = getNode();

export const authorsBookFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  bookId: { type: GraphQLNonNull(GraphQLID) },
  authorId: { type: GraphQLNonNull(GraphQLID) }
};

const authorsIdInput = new GraphQLInputObjectType({
  name: 'AuthorsIdInput',
  fields: {
    authorId: { type: GraphQLNonNull(GraphQLID) }
  }
});

const booksIdInput = new GraphQLInputObjectType({
  name: 'BooksIdInput',
  fields: {
    bookId: { type: GraphQLNonNull(GraphQLID) }
  }
});

const AuthorsBook = new GraphQLObjectType({
  name: 'AuthorsBook',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(authorsBookFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    authors: {
      ...authorQueries.list,
      resolve: (sources, args, context, info) =>
        authorQueries.list.resolve(sources, args, { ...context, book: sources.dataValues }, info)
    }
  })
});

export const authorsBookFieldsMutation = {
  authorsIdArray: { type: GraphQLList(authorsIdInput) },
  booksIdArray: { type: GraphQLList(booksIdInput) }
};

const AuthorsBookConnection = createConnection({
  nodeType: AuthorsBook,
  name: 'authorsBooks',
  target: db.authorsBooks,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the authorsBooks table
export const authorsBookQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: AuthorsBook
  },
  list: {
    ...AuthorsBookConnection,
    type: AuthorsBookConnection.connectionType,
    args: AuthorsBookConnection.connectionArgs
  },
  model: db.authorsBooks
};

export const authorsBookMutations = {
  args: authorsBookFields,
  type: AuthorsBook,
  model: db.authorsBooks
};
