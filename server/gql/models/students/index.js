import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { sequelizedWhere } from '@server/database/dbUtils';
import { subjectQueries } from '../subjects';

const { nodeInterface } = getNode();

export const studentsFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString },
  subjectId: { type: GraphQLID }
};

const Student = new GraphQLObjectType({
  name: 'Student',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(studentsFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    subjects: {
      ...subjectQueries.list,
      resolve: (source, args, context, info) =>
        subjectQueries.list.resolve(source, args, { ...context, student: source.dataValues }, info)
    }
  })
});

const StudentConnection = createConnection({
  name: 'students',
  target: db.students,
  nodeType: Student,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];
    if (context?.subject?.id) {
      console.log('running or not');
      findOptions.include.push({
        model: db.studentSubjects,
        where: {
          subjectId: context.subject.id
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
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
  args: studentsFields,
  type: Student,
  model: db.students
};
