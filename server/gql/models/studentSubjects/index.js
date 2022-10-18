import { getNode } from '@gql/node';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from '../timestamps';
import { sequelizedWhere } from '@server/database/dbUtils';

const { nodeInterface } = getNode();

export const studentSubjectFields = {
  id: { type: new GraphQLNonNull(GraphQLID) },
  studentId: { type: new GraphQLNonNull(GraphQLID) },
  subjectId: { type: new GraphQLNonNull(GraphQLID) }
};
export const StudentSubject = new GraphQLObjectType({
  name: 'StudentSubject',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(studentSubjectFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps
  })
});

export const StudentSubjectConnection = createConnection({
  nodeType: StudentSubject,
  name: 'studentSubjects',
  target: db.studentSubjects,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the studentSubjects table
export const studentSubjectQueries = {
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: StudentSubject
  },
  list: {
    ...StudentSubjectConnection,
    resolve: StudentSubjectConnection.resolve,
    type: StudentSubjectConnection.connectionType,
    args: StudentSubjectConnection.connectionArgs
  },
  model: db.studentSubjects
};

export const studentSubjectMutations = {
  args: studentSubjectFields,
  type: StudentSubject,
  model: db.studentSubjects
};
