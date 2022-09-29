import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Op } from 'sequelize';
import { createConnection } from 'graphql-sequelize';

import { getNode } from '@gql/node';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@server/utils';
import { sequelizedWhere } from '@server/database/dbUtils';
import { bookQueries } from '../books';

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
      ...bookQueries.list,
      resolve: (source, args, context, info) =>
        bookQueries.list.resolve(source, args, { ...context, publisher: source.dataValues }, info)
    }
  })
});

const PublisherConnection = createConnection({
  nodeType: Publisher,
  name: 'Publisher',
  target: db.publishers,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = findOptions.where || {};
    findOptions = addBeforeWhere(findOptions, args, context);

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

const addBeforeWhere = (findOptions, args, context) => {
  args = { ...args, ...context.parentArgs };
  findOptions.where = findOptions.where || {};
  if (args.publishers) {
    findOptions.where = {
      ...findOptions.where,
      name: {
        [Op.iLike]: `%${args.publishers}%`
      }
    };
  }
  if (args.name) {
    findOptions.where = {
      ...findOptions.where,
      name: {
        [Op.iLike]: `%${args.name}%`
      }
    };
  }

  findOptions.where = sequelizedWhere(findOptions.where, args.where);

  return findOptions;
};

export { PublisherConnection, Publisher };

// queries on the books table
export const publisherQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Publisher,
    extras: {
      before: (findOptions, args, context) => addBeforeWhere(findOptions, args, context)
    }
  },
  list: {
    ...PublisherConnection,
    type: PublisherConnection.connectionType,
    args: {
      ...PublisherConnection.connectionArgs,
      name: {
        type: GraphQLString
      }
    }
  },
  model: db.publishers
};

export const publisherMutations = {
  args: publisherFields,
  type: Publisher,
  model: db.publishers
};
