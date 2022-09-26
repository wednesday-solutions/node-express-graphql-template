import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';

import { getNode } from '@gql/node';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields, transformSQLError } from '@server/utils';
import { AuthorConnection } from '@gql/models/authors';
import { sequelizedWhere } from '@server/database/dbUtils';
import { insertBook, queryUsingGenres, updateBook } from '@server/daos/books';
import { insertAuthorsBooks, updateAuthorsBooksForBooks } from '@server/daos/authorsBooks';
import { authorsBookFieldsMutation } from '@gql/models/authorsBooks';
import { LanguageConnection } from '@gql/models/languages';
import { PublisherConnection } from '@gql/models/publishers';
import { insertBooksLanguages, updateBooksLanguagesForBooks } from '@server/daos/booksLanguages';
import { booksLanguageFieldsMutation } from '@gql/models/booksLanguages';

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

    if (context?.publisher?.id) {
      findOptions.include.push({
        model: db.publishers,
        where: {
          id: context.publisher.id
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
      publisherId: args.publisherId
    };

    const authorsBooksArgs = { authorsBooks: args.authorsId };
    const booksLanguagesArgs = { booksLanguages: args.languagesId };

    const bookRes = await insertBook(bookArgs);
    const bookId = bookRes.id;

    await insertAuthorsBooks({ ...authorsBooksArgs, bookId });
    await insertBooksLanguages({ ...booksLanguagesArgs, bookId });

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
      pages: args.pages
    };

    const authorsBooksArgs = { authorsBooks: args.authorsId };
    const booksLanguagesArgs = { booksLanguages: args.languagesId };

    const bookRes = await updateBook(bookArgs);
    const bookId = bookRes.id;

    await updateAuthorsBooksForBooks({ ...authorsBooksArgs, bookId });

    await updateBooksLanguagesForBooks({ ...booksLanguagesArgs, bookId });

    return bookRes;
  } catch (err) {
    throw transformSQLError(err);
  }
};

export const bookFieldsMutation = {
  ...booksFields,
  publisherId: { type: GraphQLNonNull(GraphQLID) },
  authorsId: authorsBookFieldsMutation.authorsIdArray,
  languagesId: booksLanguageFieldsMutation.languagesIdArray
};

export const bookMutations = {
  args: bookFieldsMutation,
  type: Book,
  model: db.books,
  customCreateResolver,
  customUpdateResolver
};

export const customBooksQuery = async (parent, args, context, resolveInfo) => {
  try {
    let queriedRows;
    const { genres } = args;

    queriedRows = await db.books.findAll();

    if (genres) {
      queriedRows = await queryUsingGenres(genres);
    }

    return queriedRows;
  } catch (err) {
    throw transformSQLError(err);
  }
};
