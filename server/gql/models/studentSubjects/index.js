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
  id: { type: GraphQLNonNull(GraphQLID) },
  studentId: { type: GraphQLInt },
  subjectId: { type: GraphQLInt }
};
export const StudentSubject = new GraphQLObjectType({
  name: 'StudentSubject',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(studentSubjectFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps
  })
});

console.log('StudentSubject:', StudentSubject);

export const StudentSubjectConnection = createConnection({
  nodeType: StudentSubject,
  name: 'studentSubjects',
  target: db.studentSubjects,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.student?.id) {
      findOptions.include.push({
        model: db.students,
        where: {
          id: context.student.id
        }
      });
    }
    if (context?.subject?.id) {
      findOptions.include.push({
        model: db.subjects,
        where: {
          id: context.subject.id
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
    return findOptions;
  },
  ...totalConnectionFields
});

// queries on the studentSubjects table
export const studentSubjectQueries = {
  args: {
    id: {
      type: GraphQLNonNull(GraphQLInt)
    }
  },
  query: {
    type: StudentSubject
  },
  list: {
    ...StudentSubjectConnection,
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
