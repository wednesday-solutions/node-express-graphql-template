import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productQueries } from './products';
import { getNode } from '@gql/node';
import db from '@database/models';
import { sequelizedWhere } from '@database/dbUtils';
import { totalConnectionFields } from '@utils/index';
import { Op } from 'sequelize';

const { nodeInterface } = getNode();

export const manufacturerFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  origin_country: { type: GraphQLString }
};

export const Manufacturer = new GraphQLObjectType({
  name: 'Manufacturer',
  interfaces: [nodeInterface],
  fields: () => ({
    ...manufacturerFields,
    products: {
      ...productQueries.list,
      resolve: (source, args, context, info) =>
        productQueries.list.resolve(source, args, { ...context, store: source.dataValues }, info)
    }
  })
});

export const ManufacturerConnection = createConnection({
  nodeType: Manufacturer,
  name: 'manufacturer',
  target: db.manufacturers,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.product?.id) {
      findOptions.include.push({
        model: db.products,
        where: {
          id: context.product.id
        }
      });
    }
    if (args.likeName) {
      findOptions.where = { ...findOptions.where, name: { [Op.iLike]: `%${args.likeName}%` } };
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },

  ...totalConnectionFields
});

// queries on the suppliers table
export const manufacturerQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID)
    }
  },
  query: {
    type: Manufacturer
  },
  list: {
    ...ManufacturerConnection,
    type: ManufacturerConnection.connectionType,
    args: { ...ManufacturerConnection.connectionArgs, likeName: { type: GraphQLString } }
  },
  model: db.manufacturers
};

export const manufacturerMutations = {
  args: manufacturerFields,
  type: Manufacturer,
  model: db.manufacturers
};
