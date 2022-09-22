import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields, transformSQLError } from '@server/utils';
import { AuthorConnection } from '../authors';
import { sequelizedWhere } from '@server/database/dbUtils';
import { insertBook, updateBook } from '@server/daos/books';
import { insertAuthorsBooks, updateAuthorsBooksForBooks } from '@server/daos/authorsBooks';
import { authorsBookFieldsMutation } from '../authorsBooks';
import { LanguageConnection } from '../languages';
import { PublisherConnection } from '../publishers';

const { nodeInterface } = getNode();

export const booksFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  genres: { type: GraphQLString },
  pages: { type: GraphQLString }
};

const Book = new GraphQLObjectType({
  name: 'Book',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(booksFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    authors: {
      type: AuthorConnection.connectionType,
      args: AuthorConnection.connectionArgs,
      resolve: (source, args, context, info) =>
        AuthorConnection.resolve(source, args, { ...context, book: source.dataValues }, info)
    },
    languages: {
      type: LanguageConnection.connectionType,
      args: LanguageConnection.connectionArgs,
      resolve: (source, args, context, info) =>
        LanguageConnection.resolve(source, args, { ...context, book: source.dataValues }, info)
    },
    publishers: {
      type: PublisherConnection.connectionType,
      args: PublisherConnection.connectionArgs,
      resolve: (source, args, context, info) =>
        PublisherConnection.resolve(source, args, { ...context, book: source.dataValues }, info)
    }
  })
});

const BookConnection = createConnection({
  nodeType: Book,
  name: 'books',
  target: db.books,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.author?.id) {
      findOptions.include.push({
        model: db.authorsBooks,
        where: {
          authorId: context.author.id
        }
      });
    }

    if (context?.language?.id) {
      findOptions.include.push({
        model: db.booksLanguages,
        where: {
          languageId: context.language.id
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);

    return findOptions;
  },
  ...totalConnectionFields
});

export { BookConnection, Book };

// queries on the books table
export const bookQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Book
  },
  list: {
    ...BookConnection,
    type: BookConnection.connectionType,
    args: BookConnection.connectionArgs
  },
  model: db.books
};

export const customCreateResolver = async (model, args, context) => {
  try {
    const bookArgs = {
      name: args.name,
      genres: args.genres,
      pages: args.pages,
      publishedBy: args.publishedBy
    };

    const authorsBooksArgs = { authorsBooks: args.authorsBooks };
    const bookRes = await insertBook(bookArgs);
    const bookId = bookRes.id;
    await insertAuthorsBooks({ ...authorsBooksArgs, bookId });

    return bookRes;
  } catch (err) {
    throw transformSQLError(err);
  }
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

    const authorsBooksArgs = { authorsBooks: args.authorsId };
    const bookRes = await updateBook(bookArgs);
    const bookId = bookRes.id;

    await updateAuthorsBooksForBooks({ ...authorsBooksArgs, bookId });

    return bookRes;
  } catch (err) {
    throw transformSQLError(err);
  }
};

export const bookFieldsMutation = {
  ...booksFields,
  authorsId: authorsBookFieldsMutation.authorsIdArray
};

export const bookMutations = {
  args: bookFieldsMutation,
  type: Book,
  model: db.books,
  customCreateResolver,
  customUpdateResolver
};
