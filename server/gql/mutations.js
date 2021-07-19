import upperFirst from 'lodash/upperFirst';
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createModelGetter, getFileNames } from '@utils';
import { GRAPHQL_MODEL_EXCLUDES } from '@utils/constants';
import { deletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';

export const createResolvers = model => ({
  createResolver: (parent, args, context, resolveInfo) => model.create(args),
  updateResolver: (parent, args, context, resolveInfo) => updateUsingId(model, args),
  deleteResolver: (parent, args, context, resolveInfo) => deleteUsingId(model, args)
});

const getModelMutations = async dir => {
  const tables = {};
  const setMutations = createModelGetter({ append: 'Mutations', tables });
  const models = getFileNames(dir, GRAPHQL_MODEL_EXCLUDES);
  const importModels = async (fileName, callback) => {
    const modelPath = `${'./models'}/${fileName}`;
    const model = await import(`${modelPath}`);
    if (callback) {
      callback(fileName, model);
    }
  };
  await Promise.all(models.map(modelName => importModels(modelName, setMutations)));
  return tables;
};

export const addMutations = async () => {
  const mutations = {};
  const DB_TABLES = await getModelMutations('./server/gql/models');
  Object.keys(DB_TABLES).forEach(table => {
    const mutationConfig = DB_TABLES[table];
    const { id, ...createArgs } = mutationConfig.args;
    mutations[`create${upperFirst(table)}`] = {
      ...mutationConfig,
      args: createArgs,
      resolve: createResolvers(mutationConfig.model).createResolver
    };
    mutations[`update${upperFirst(table)}`] = {
      ...mutationConfig,
      resolve: createResolvers(mutationConfig.model).updateResolver
    };
    mutations[`delete${upperFirst(table)}`] = {
      type: deletedId,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: createResolvers(mutationConfig.model).deleteResolver
    };
  });
  return mutations;
};

export const createRootMutation = async () => {
  const mutations = await addMutations();
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...mutations
    })
  });
};
