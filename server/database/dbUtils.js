import { GraphQLNonNull, GraphQLInt, GraphQLObjectType } from 'graphql';
export const updateUsingId = async (model, args) => {
  let affectedRows;
  try {
    [affectedRows] = await model.update(args, {
      where: {
        id: args.id,
        deletedAt: null
      }
    });
  } catch (e) {
    throw new Error(`Failed to update ${model.name}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return model.findOne({ where: { id: args.id } });
};

export const deleteUsingId = async (model, args) => {
  let affectedRows;
  try {
    affectedRows = await model.destroy({ where: { id: args.id, deletedAt: null } });
  } catch (e) {
    throw new Error(`Failed to delete ${model.name}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return args;
};

export const DeletedId = new GraphQLObjectType({
  name: 'Id',
  fields: () => ({ id: { type: GraphQLNonNull(GraphQLInt) } })
});
