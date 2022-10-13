import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();
export const subjectFields = {
  id: {
    type: GraphQLID,
    [TYPE_ATTRIBUTES.isNonNull]: true
  },
  name: {
    type: GraphQLString,
    [TYPE_ATTRIBUTES.isNonNull]: true
  }
};
const Subject = new GraphQLObjectType({
  name: 'Subject',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(subjectFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps
  })
});

const SubjectConnection = createConnection({
  name: 'subjects',
  target: db.subjects,
  nodeType: Subject,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];

    return findOptions;
  },
  ...totalConnectionFields
});

export { SubjectConnection, Subject };

// queries on the subject table
export const subjectQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Subject
  },
  list: {
    ...SubjectConnection,
    resolve: SubjectConnection.resolve,
    type: SubjectConnection.connectionType,
    args: SubjectConnection.connectionArgs
  },
  model: db.subjects
};

export const subjectMutations = {
  args: subjectFields,
  type: Subject,
  model: db.subjects
};
