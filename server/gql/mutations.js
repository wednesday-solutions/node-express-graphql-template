import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import upperFirst from 'lodash/upperFirst';
import { productMutations } from '@gql/models/products';
import { purchasedProductMutations } from '@gql/models/purchasedProducts';
import { supplierMutations } from '@gql/models/suppliers';
import { deletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';
import { addressMutations } from '@gql/models/addresses';
import { storeMutations } from '@gql/models/stores';
import { storeProductMutations } from '@gql/models/storeProducts';
import { supplierProductMutations } from '@gql/models/supplierProducts';
import { userMutations } from '@gql/models/users';
import { MUTATION_TYPE } from '@utils/constants';

const shouldNotAddMutation = (type, table) => {
  if (type === MUTATION_TYPE.CREATE) {
    const negateTablesList = ['users'];
    return !negateTablesList.includes(table);
  }

  if (type === MUTATION_TYPE.UPDATE) {
    const negateTablesList = [];
    return !negateTablesList.includes(table);
  }

  if (type === MUTATION_TYPE.DELETE) {
    const negateTablesList = ['users'];
    return !negateTablesList.includes(table);
  }
};

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
  supplierProduct: supplierProductMutations,
  users: userMutations
};

export const addMutations = () => {
  const mutations = {};

  Object.keys(DB_TABLES).forEach(table => {
    const { id, ...createArgs } = DB_TABLES[table].args;

    if (shouldNotAddMutation(MUTATION_TYPE.CREATE, table)) {
      mutations[`create${upperFirst(table)}`] = {
        ...DB_TABLES[table],
        args: createArgs,
        resolve: createResolvers(DB_TABLES[table].model).createResolver
      };
    }

    if (shouldNotAddMutation(MUTATION_TYPE.UPDATE, table)) {
      mutations[`update${upperFirst(table)}`] = {
        ...DB_TABLES[table],
        resolve: createResolvers(DB_TABLES[table].model).updateResolver
      };
    }

    if (shouldNotAddMutation(MUTATION_TYPE.DELETE, table)) {
      mutations[`delete${upperFirst(table)}`] = {
        type: deletedId,
        args: {
          id: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: createResolvers(DB_TABLES[table].model).deleteResolver
      };
    }
  });
  return mutations;
};

export const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...addMutations()
  })
});
