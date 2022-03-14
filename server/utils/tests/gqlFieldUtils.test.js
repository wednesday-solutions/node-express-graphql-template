const { GraphQLID, GraphQLNonNull } = require('graphql');
const { getQueryFields, CREATE_AND_QUERY_REQUIRED_ARGS, TYPE_ATTRIBUTES } = require('../gqlFieldUtils');

describe('getQueryFields', () => {
  it('should return type wrapped in GraphQLNonNull', () => {
    const baseFields = {
      id: {
        type: GraphQLID,
        ...CREATE_AND_QUERY_REQUIRED_ARGS
      },
      prop: {
        type: GraphQLID
      }
    };
    const fields = getQueryFields(baseFields, TYPE_ATTRIBUTES.isCreateRequired);
    expect(fields.id.type).toEqual(GraphQLNonNull(baseFields.id.type));
    expect(fields.prop.type).toEqual(baseFields.prop.type);
  });
});
