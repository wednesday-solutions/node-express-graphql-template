import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import upperFirst from 'lodash/upperFirst';
import { deletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';
import { MUTATION_TYPE } from '@utils/constants';
import { getQueryFields, TYPE_ATTRIBUTES } from '@utils/gqlFieldUtils';
import { getGqlModels } from '@server/utils/autogenHelper';
import { handleSignIn, handleSignUp } from '@server/gql/auth';
import { GraphQLDateTime } from 'graphql-iso-date';
const shouldAddMutation = (type, table) => {
  if (type === MUTATION_TYPE.CREATE) {
    const negateTablesList = ['user'];
    return !negateTablesList.includes(table);
  }

  if (type === MUTATION_TYPE.UPDATE) {
    const negateTablesList = ['purchasedProduct'];
    return !negateTablesList.includes(table);
  }

  if (type === MUTATION_TYPE.DELETE) {
    const negateTablesList = ['user'];
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

export const DB_TABLES = getGqlModels({ type: 'Mutations', blacklist: ['aggregate', 'timestamps'] });

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
          id: { type: new GraphQLNonNull(GraphQLInt) }
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
    ...addMutations(),
    signUp: {
      type: new GraphQLObjectType({
        name: 'SignUpResponse',
        fields: () => ({
          id: { type: new GraphQLNonNull(GraphQLID) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          firstName: { type: new GraphQLNonNull(GraphQLString) },
          lastName: { type: new GraphQLNonNull(GraphQLString) },
          token: { type: new GraphQLNonNull(GraphQLString) },
          createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
          updatedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
          deletedAt: { type: GraphQLDateTime }
        })
      }),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: handleSignUp
    },
    signIn: {
      type: new GraphQLObjectType({
        name: 'SignInResponse',
        fields: () => ({
          token: { type: new GraphQLNonNull(GraphQLString) }
        })
      }),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: handleSignIn
    }
  })
});
