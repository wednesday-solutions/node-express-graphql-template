import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';

import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields, transformSQLError } from '@server/utils';
import { sequelizedWhere } from '@server/database/dbUtils';
import { BookConnection } from '@gql/models/books';
import { updateLanguage } from '@server/daos/languages';
import { updateBooksLanguagesForLanguages } from '@server/daos/booksLanguages';
import { booksLanguageFieldsMutation } from '@gql/models/booksLanguages';

const { nodeInterface } = getNode();

export const languageFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  language: { type: GraphQLString }
};

const Language = new GraphQLObjectType({
  name: 'Language',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(languageFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    books: {
      type: BookConnection.connectionType,
      args: BookConnection.connectionArgs,
      resolve: (source, args, context, info) =>
        BookConnection.resolve(source, args, { ...context, language: source.dataValues }, info)
    }
  })
});

const LanguageConnection = createConnection({
  nodeType: Language,
  name: 'Language',
  target: db.languages,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.book?.id) {
      findOptions.include.push({
        model: db.booksLanguages,
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

export { LanguageConnection, Language };

// queries on the books table
export const languageQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Language
  },
  list: {
    ...LanguageConnection,
    type: LanguageConnection.connectionType,
    args: LanguageConnection.connectionArgs
  },
  model: db.languages
};

export const customUpdateResolver = async (model, args, context) => {
  try {
    const languageArgs = {
      id: args.id,
      name: args.name,
      country: args.country
    };

    const booksLanguagesArgs = { booksLanguages: args.booksId };
    const languageRes = await updateLanguage(languageArgs);
    const languageId = languageRes.id;

    await updateBooksLanguagesForLanguages({ ...booksLanguagesArgs, languageId });

    return languageRes;
  } catch (err) {
    throw transformSQLError(err);
  }
};

export const languageFieldsMutation = {
  ...languageFields,
  booksId: booksLanguageFieldsMutation.booksIdArray
};

export const languageMutations = {
  args: languageFieldsMutation,
  type: Language,
  model: db.languages,
  customUpdateResolver
};
