import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import { createConnection } from 'graphql-sequelize';
import db from '@database/models';
import { totalConnectionFields, transformSQLError } from '@server/utils';
// import { bookQueries } from '../books';
import { sequelizedWhere } from '@server/database/dbUtils';
import { BookConnection } from '../books';
import { updateAuthor } from '@server/daos/authors';
import { updateAuthorsBooks } from '@server/daos/authorsBooks';

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
    const bookArgs = {
      id: args.id,
      name: args.name,
      genres: args.genres,
      pages: args.pages,
      publishedBy: args.publishedBy
    };

    console.log('arguments in custom update resolver of books model', args);

    const authorsBooksArgs = { authorsBooks: args.authorsBooks };
    const bookRes = await updateAuthor(bookArgs);
    const bookId = bookRes.id;

    await updateAuthorsBooks({ ...authorsBooksArgs, bookId });

    console.log('\x1b[42m%s\x1b[0m', 'books res', bookRes);

    return bookRes;
  } catch (err) {
    throw transformSQLError(err);
  }
};

export const authorMutations = {
  args: authorsFields,
  type: Author,
  model: db.authors
};
