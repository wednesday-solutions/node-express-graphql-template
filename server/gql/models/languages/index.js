import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';

import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@server/utils';
import { sequelizedWhere } from '@server/database/dbUtils';
import { BookConnection } from '../books';

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
          languageId: context.book.id
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

export const languageMutations = {
  args: languageFields,
  type: Language,
  model: db.languages
};
