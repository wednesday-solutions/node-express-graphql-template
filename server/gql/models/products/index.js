import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { getNode } from '@gql/node';
import { SupplierConnection } from '../suppliers';
import { storeLists } from '../stores';
import { timestamps } from '@gql/fields/timestamps';
import db from '@database/models';
import { sequelizedWhere } from '@database/dbUtils';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();
export const productFields = {
  id: { type: new GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  category: { type: GraphQLString },
  amount: { type: GraphQLInt }
};

// Product
export const GraphQLProduct = new GraphQLObjectType({
  name: 'Product',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(productFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    suppliers: {
      type: SupplierConnection.connectionType,
      args: SupplierConnection.connectionArgs,
      resolve: (source, args, context, info) =>
        SupplierConnection.resolve(source, args, { ...context, product: source.dataValues }, info)
    },
    stores: {
      ...storeLists.list,
      resolve: (source, args, context, info) =>
        storeLists.list.resolve(source, args, { ...context, product: source.dataValues }, info)
    }
  })
});

// relay compliant list
export const ProductConnection = createConnection({
  nodeType: GraphQLProduct,
  name: 'products',
  target: db.products,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.purchasedProduct?.id) {
      findOptions.include.push({
        model: db.purchasedProducts,
        where: {
          id: context.purchasedProduct.id
        }
      });
    }

    if (context?.supplier?.id) {
      findOptions.include.push({
        model: db.suppliers,
        where: {
          id: context.supplier?.id
        }
      });
    }

    if (context?.store?.id) {
      findOptions.include.push({
        model: db.stores,
        where: {
          id: context.store?.id
        }
      });
    }

    if (context?.supplierProduct?.id) {
      findOptions.include.push({
        model: db.supplierProducts,
        where: {
          id: context.supplierProduct.id
        }
      });
    }

    if (context?.storeProduct?.productId) {
      findOptions.include.push({
        model: db.storeProducts,
        where: {
          productId: context.storeProduct.productId
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the product table
export const productQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: GraphQLProduct
  },
  model: db.products
};

// lists on the product table.
export const productLists = {
  list: {
    ...ProductConnection,
    type: ProductConnection.connectionType,
    args: ProductConnection.connectionArgs
  },
  model: db.products
};

export const productMutations = {
  args: productFields,
  type: GraphQLProduct,
  model: db.products
};
