import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';

const { nodeInterface } = getNode();
export const studentFields = {
  id: {
    type: GraphQLID,
    [TYPE_ATTRIBUTES.isNonNull]: true
  },
  name: {
    type: GraphQLString,
    [TYPE_ATTRIBUTES.isNonNull]: true
  }
};
const Student = new GraphQLObjectType({
  name: 'Student',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(studentFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps
  })
});

const StudentConnection = createConnection({
  name: 'students',
  target: db.students,
  nodeType: Student,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];

    return findOptions;
  },
  ...totalConnectionFields
});

export { StudentConnection, Student };

// queries on the student table
export const studentQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: Student
  },
  list: {
    ...StudentConnection,
    resolve: StudentConnection.resolve,
    type: StudentConnection.connectionType,
    args: StudentConnection.connectionArgs
  },
  model: db.students
};

export const studentMutations = {
  args: studentFields,
  type: Student,
  model: db.students
};
