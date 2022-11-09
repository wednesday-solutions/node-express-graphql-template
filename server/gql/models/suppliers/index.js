import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { productLists } from '../products';
import { timestamps } from '@gql/fields/timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { addressLists } from '@gql/models/addresses';
import { totalConnectionFields } from '@utils/index';
import { sequelizedWhere } from '@database/dbUtils';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();

export const supplierFields = {
  id: { type: new GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  addressId: { type: GraphQLInt }
};
const GraphQLSupplier = new GraphQLObjectType({
  name: 'Supplier',
  interfaces: [nodeInterface],

  sqlPaginate: true,
  fields: () => ({
    ...getQueryFields(supplierFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    addresses: {
      ...addressLists.list,
      resolve: (source, args, context, info) =>
        addressLists.list.resolve(source, args, { ...context, supplier: source.dataValues }, info)
    },
    products: {
      ...productLists.list,
      resolve: (source, args, context, info) =>
        productLists.list.resolve(source, args, { ...context, supplier: source.dataValues }, info)
    }
  })
});

export const SupplierConnection = createConnection({
  nodeType: GraphQLSupplier,
  name: 'suppliers',
  target: db.suppliers,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.product?.id) {
      findOptions.include.push({
        model: db.supplierProducts,
        where: {
          productId: context.product.id
        }
      });
    }

    if (context?.address?.id) {
      findOptions.include.push({
        model: db.addresses,
        where: {
          id: context.address.id
        }
      });
    }

    if (context?.supplierProduct?.supplierId) {
      findOptions.include.push({
        model: db.supplierProducts,
        where: {
          supplierId: context.supplierProduct.supplierId
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the suppliers table
export const supplierQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLSupplier
  },
  model: db.suppliers
};

// lists on the suppliers table
export const supplierLists = {
  list: {
    ...SupplierConnection,
    type: SupplierConnection.connectionType,
    args: SupplierConnection.connectionArgs
  },
  model: db.suppliers
};

export const supplierMutations = {
  args: supplierFields,
  type: GraphQLSupplier,
  model: db.suppliers
};
