import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';

import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields, transformSQLError } from '@server/utils';
import { sequelizedWhere } from '@server/database/dbUtils';
import { BookConnection } from '../books';
import { updateAuthor } from '@server/daos/authors';
import { updateAuthorsBooksForAuthors } from '@server/daos/authorsBooks';
import { authorsBookFieldsMutation } from '../authorsBooks';

const { nodeInterface } = getNode();

export const authorsFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  country: { type: GraphQLString },
  age: { type: GraphQLInt }
};

const Author = new GraphQLObjectType({
  name: 'Author',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(authorsFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    books: {
      type: BookConnection.connectionType,
      args: BookConnection.connectionArgs,
      resolve: (source, args, context, info) =>
        BookConnection.resolve(source, args, { ...context, author: source.dataValues }, info)
    }
  })
});

const AuthorConnection = createConnection({
  nodeType: Author,
  name: 'Author',
  target: db.authors,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.book?.id) {
      findOptions.include.push({
        model: db.authorsBooks,
        where: {
          bookId: context.book.id
        }
      });
    }

    findOptions.where = sequelizedWhere(findOptions.where, args.where);

    return findOptions;
  },
  ...totalConnectionFields
});

export { AuthorConnection, Author };

// queries on the books table
export const authorQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Author
  },
  list: {
    ...AuthorConnection,
    type: AuthorConnection.connectionType,
    args: AuthorConnection.connectionArgs
  },
  model: db.authors
};

export const customUpdateResolver = async (model, args, context) => {
  try {
    const authorArgs = {
      id: args.id,
      name: args.name,
      country: args.country,
      age: args.age
    };

    const authorsBooksArgs = { authorsBooks: args.booksId };
    const authorRes = await updateAuthor(authorArgs);
    const authorId = authorRes.id;

    await updateAuthorsBooksForAuthors({ ...authorsBooksArgs, authorId });

    return authorRes;
  } catch (err) {
    throw transformSQLError(err);
  }
};

export const authorFieldsMutation = {
  ...authorsFields,
  booksId: authorsBookFieldsMutation.booksIdArray
};

export const authorMutations = {
  args: authorFieldsMutation,
  type: Author,
  model: db.authors,
  customUpdateResolver
};
