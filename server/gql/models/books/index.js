import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { Op } from 'sequelize';

import { getNode } from '@gql/node';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields, transformSQLError } from '@server/utils';
import { AuthorConnection } from '@gql/models/authors';
import { sequelizedWhere } from '@server/database/dbUtils';
import { insertBook, updateBook } from '@server/daos/books';
import { insertAuthorsBooks, updateAuthorsBooksForBooks } from '@server/daos/authorsBooks';
import { authorsBookFieldsMutation } from '@gql/models/authorsBooks';
import { insertBooksLanguages, updateBooksLanguagesForBooks } from '@server/daos/booksLanguages';
import { booksLanguageFieldsMutation } from '@gql/models/booksLanguages';
import { languageQueries } from '@gql/models/languages';
import { publisherQueries } from '@gql/models/publishers';


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
      ...languageQueries.list,
      resolve: (source, args, context, info) => {
        if (context.parentArgs.languages) {
          args.languages = context.parentArgs.languages;
        }
        return languageQueries.list.resolve(source, args, { ...context, book: source.dataValues }, info);
      }
    },
    publishers: {
      ...publisherQueries.list,
      resolve: (source, args, context, info) => {
        if (context.parentArgs.publishers) {
          args.name = context.parentArgs.publishers;
        }
        return publisherQueries.list.resolve(source, args, { ...context, book: source.dataValues }, info);
      }
    }
  })
});

const BookConnection = createConnection({
  nodeType: Book,
  name: 'books',
  target: db.books,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = findOptions.where || {};
    findOptions = addBeforeWhere(findOptions, args, context);

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

const addBeforeWhere = (findOptions, args, context) => {
  args = { ...args, ...context.parentArgs };
  findOptions.where = findOptions.where || {};

  if (args.publishers) {
    findOptions.include.push({
      model: db.publishers,
      where: {
        name: {
          [Op.iLike]: `%${args.publishers}%`
        }
      }
    });
  }

  if (args.languages) {
    findOptions.include.push({
      model: db.languages,
      where: {
        language: {
          [Op.iLike]: `%${args.languages}%`
        }
      }
    });
  }

  if (args.genres) {
    findOptions.where = {
      ...findOptions.where,
      genres: {
        [Op.iLike]: `%${args.genres}%`
      }
    };
  }

  return findOptions;
};

export { BookConnection, Book };

// queries on the books table
export const bookQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    },
    publishers: {
      type: GraphQLString
    }
  },
  query: {
    type: Book,
    extras: {
      before: (findOptions, args, context) => addBeforeWhere(findOptions, args, context)
    }
  },
  list: {
    ...BookConnection,
    resolve: BookConnection.resolve,
    type: BookConnection.connectionType,
    args: {
      ...BookConnection.connectionArgs,
      publishers: {
        type: GraphQLString
      },
      languages: {
        type: GraphQLString
      },
      genres: {
        type: GraphQLString
      }
    }
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
