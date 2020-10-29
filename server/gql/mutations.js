import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import capitalize from 'lodash/capitalize';
import { productMutations } from '@gql/models/products';
import { purchasedProductMutations } from '@gql/models/purchasedProducts';
import { supplierMutations } from '@gql/models/suppliers';
import { DeletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';
import { addressMutations } from '@gql/models/addresses';
import { storeMutations } from '@gql/models/stores';
import { storeProductMutations } from '@gql/models/storeProducts';
import { supplierProductMutations } from '@gql/models/supplierProducts';

export const createResolvers = model => ({
  createResolver: (parent, args, context, resolveInfo) => model.create(args),
  updateResolver: (parent, args, context, resolveInfo) => updateUsingId(model, args),
  deleteResolver: (parent, args, context, resolveInfo) => deleteUsingId(model, args)
});
export const DB_TABLES = {
  product: productMutations,
  purchasedProduct: purchasedProductMutations,
  address: addressMutations,
  store: storeMutations,
  storeProduct: storeProductMutations,
  supplier: supplierMutations,
  supplierProduct: supplierProductMutations
};

export const addMutations = () => {
  const mutations = {};

  Object.keys(DB_TABLES).forEach(table => {
    const { id, ...createArgs } = DB_TABLES[table].args;
    mutations[`create${capitalize(table)}`] = {
      ...DB_TABLES[table],
      args: createArgs,
      resolve: createResolvers(DB_TABLES[table].model).createResolver
    };
    mutations[`update${capitalize(table)}`] = {
      ...DB_TABLES[table],
      resolve: createResolvers(DB_TABLES[table].model).updateResolver
    };
    mutations[`delete${capitalize(table)}`] = {
      type: DeletedId,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: createResolvers(DB_TABLES[table].model).deleteResolver
    };
  });
  return mutations;
};

export const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...addMutations()
  })
});
