import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
// import { Address } from './addresses';
import { productQueries } from './products';
import { timestamps } from './timestamps';
import { getNode } from '@gql/node';
import db from '@database/models';
import { addressQueries } from '@gql/models/addresses';
import { totalConnectionFields, getQueryFields, REQUIRED_ARGS, CREATE_AND_QUERY_REQUIRED_ARGS } from '@utils/index';
import { TYPE_ATTRIBUTES } from '@utils/constants';

const { nodeInterface } = getNode();

export const supplierFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString, ...CREATE_AND_QUERY_REQUIRED_ARGS },
  addressId: { type: GraphQLInt, ...REQUIRED_ARGS }
};
const Supplier = new GraphQLObjectType({
  name: 'Supplier',
  interfaces: [nodeInterface],

  sqlPaginate: true,
  fields: () => ({
    ...getQueryFields(supplierFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    addresses: {
      ...addressQueries.list,
      resolve: (source, args, context, info) =>
        addressQueries.list.resolve(source, args, { ...context, supplier: source.dataValues }, info)
    },
    products: {
      ...productQueries.list,
      resolve: (source, args, context, info) =>
        productQueries.list.resolve(source, args, { ...context, supplier: source.dataValues }, info)
    }
  })
});

export const SupplierConnection = createConnection({
  nodeType: Supplier,
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
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the suppliers table
export const supplierQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Supplier
  },
  list: {
    ...SupplierConnection,
    type: SupplierConnection.connectionType,
    args: SupplierConnection.connectionArgs
  },
  model: db.suppliers
};

export const supplierMutations = {
  args: supplierFields,
  type: Supplier,
  model: db.suppliers
};
