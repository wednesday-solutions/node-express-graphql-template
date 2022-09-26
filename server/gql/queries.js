import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import { defaultListArgs, defaultArgs, resolver } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { getGqlModels } from '@server/utils/autogenHelper';
import { GraphQLDateTime } from 'graphql-iso-date';
import { customBooksQuery } from './models/books';
import { AuthorConnection } from './models/authors';
import { LanguageConnection } from './models/languages';
import { PublisherConnection } from './models/publishers';

const { nodeField, nodeTypeMapper } = getNode();
const DB_TABLES = getGqlModels({ type: 'Queries', blacklist: ['aggregate', 'timestamps'] });

export const createResolvers = (model, customResolver) => ({
  customQueryResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : model.create(args)
});

export const addQueries = () => {
  const query = {};
  Object.keys(DB_TABLES).forEach(table => {
    query[camelCase(table)] = {
      ...DB_TABLES[table].query,
      resolve: resolver(DB_TABLES[table].model),
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        ...DB_TABLES[table].args,
        ...defaultArgs(DB_TABLES[table].model)
      }
    };

    query[pluralize(camelCase(table))] = {
      ...DB_TABLES[table].list,
      args: {
        ...DB_TABLES[table].list?.args,
        ...defaultListArgs(DB_TABLES[table].model),
        limit: { type: GraphQLInt, description: 'Use with offset to get paginated results with total' },
        offset: { type: GraphQLInt, description: 'Use with limit to get paginated results with total' },
        before: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
        after: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
        first: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' },
        last: { type: GraphQLInt, description: 'Use with grapql-relay compliant queries' }
      }
    };
  });
  return query;
};

nodeTypeMapper.mapTypes({});

const booksFieldsForCustomResolver = new GraphQLObjectType({
  name: 'books',
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    genres: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    pages: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    deletedAt: { type: GraphQLNonNull(GraphQLDateTime) },
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
  }
});

export const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  node: nodeField,
  fields: () => ({
    ...addQueries(),
    customBookQuery: {
      type: GraphQLList(booksFieldsForCustomResolver),
      args: {
        genres: { type: GraphQLString },
        language: { type: GraphQLString },
        publisher: { type: GraphQLString }
      },
      resolve: customBooksQuery
    }
  })
});
