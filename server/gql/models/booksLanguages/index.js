import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@server/utils';
import { sequelizedWhere } from '@server/database/dbUtils';
import { languageQueries } from '@gql/models/languages';

const { nodeInterface } = getNode();

export const booksLanguageFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  bookId: { type: GraphQLNonNull(GraphQLID) },
  languageId: { type: GraphQLNonNull(GraphQLID) }
};

const languagesIdInput = new GraphQLInputObjectType({
  name: 'LanguagesIdInput',
  fields: {
    languageId: { type: GraphQLNonNull(GraphQLID) }
  }
});

const booksIdInput = new GraphQLInputObjectType({
  name: 'BookIdInput',
  fields: {
    bookId: { type: GraphQLNonNull(GraphQLID) }
  }
});

const BooksLanguage = new GraphQLObjectType({
  name: 'BooksLanguage',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(booksLanguageFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    languages: {
      ...languageQueries.list,
      resolve: (sources, args, context, info) =>
        languageQueries.list.resolve(sources, args, { ...context, book: sources.dataValues }, info)
    }
  })
});

export const booksLanguageFieldsMutation = {
  languagesIdArray: { type: GraphQLList(languagesIdInput) },
  booksIdArray: { type: GraphQLList(booksIdInput) }
};

const BooksLanguageConnection = createConnection({
  nodeType: BooksLanguage,
  name: 'booksLanguages',
  target: db.booksLanguages,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the booksLanguage table
export const booksLanguageQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: BooksLanguage
  },
  list: {
    ...BooksLanguageConnection,
    type: BooksLanguageConnection.connectionType,
    args: BooksLanguageConnection.connectionArgs
  },
  model: db.booksLanguages
};

export const booksLanguageMutations = {
  args: booksLanguageFields,
  type: BooksLanguage,
  model: db.booksLanguages
};
