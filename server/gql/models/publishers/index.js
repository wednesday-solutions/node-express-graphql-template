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

export const publisherFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  country: { type: GraphQLString }
};

const Publisher = new GraphQLObjectType({
  name: 'Publisher',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(publisherFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    books: {
      type: BookConnection.connectionType,
      args: BookConnection.connectionArgs,
      resolve: (source, args, context, info) =>
        BookConnection.resolve(source, args, { ...context, publisher: source.dataValues }, info)
    }
  })
});

const PublisherConnection = createConnection({
  nodeType: Publisher,
  name: 'Publisher',
  target: db.publishers,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.book?.id) {
      findOptions.include.push({
        model: db.books,
        where: {
          id: context.book.id
        }
      });
    }

    findOptions.where = sequelizedWhere(findOptions.where, args.where);

    return findOptions;
  },
  ...totalConnectionFields
});

export { PublisherConnection, Publisher };

// queries on the books table
export const publisherQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Publisher
  },
  list: {
    ...PublisherConnection,
    type: PublisherConnection.connectionType,
    args: PublisherConnection.connectionArgs
  },
  model: db.publishers
};

export const publisherMutations = {
  args: publisherFields,
  type: Publisher,
  model: db.publishers
};
