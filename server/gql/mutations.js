import upperFirst from 'lodash/upperFirst';
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createModelGetter, getFileNames } from '@utils';
import { MUTATION_TYPE, GRAPHQL_MODEL_EXCLUDES } from '@utils/constants';
import { deletedId, deleteUsingId, updateUsingId } from '@database/dbUtils';

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

export const createRootMutation = async () => {
  const mutations = await addMutations();
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...mutations
    })
  });
};
