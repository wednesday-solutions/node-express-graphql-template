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
import { getQueryFields, TYPE_ATTRIBUTES } from '@utils/gqlFieldUtils';
const shouldAddMutation = (type, table) => {
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
export const createResolvers = (model, customResolver) => ({
  createResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : model.create(args),
  updateResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : updateUsingId(model, args),
  deleteResolver: (parent, args, context, resolveInfo) =>
    customResolver ? customResolver(model, args, context) : deleteUsingId(model, args)
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

    if (shouldAddMutation(MUTATION_TYPE.CREATE, table)) {
      mutations[`create${upperFirst(table)}`] = {
        ...DB_TABLES[table],
        args: getQueryFields(createArgs, TYPE_ATTRIBUTES.isCreateRequired),
        resolve: createResolvers(DB_TABLES[table].model, DB_TABLES[table].customCreateResolver).createResolver
      };
    }

    if (shouldAddMutation(MUTATION_TYPE.UPDATE, table)) {
      mutations[`update${upperFirst(table)}`] = {
        ...DB_TABLES[table],
        args: getQueryFields(DB_TABLES[table].args, TYPE_ATTRIBUTES.isUpdateRequired),
        resolve: createResolvers(DB_TABLES[table].model, DB_TABLES[table].customUpdateResolver).updateResolver
      };
    }

    if (shouldAddMutation(MUTATION_TYPE.DELETE, table)) {
      mutations[`delete${upperFirst(table)}`] = {
        type: deletedId,
        args: {
          id: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: createResolvers(DB_TABLES[table].model, DB_TABLES[table].customDeleteResolver).deleteResolver
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
