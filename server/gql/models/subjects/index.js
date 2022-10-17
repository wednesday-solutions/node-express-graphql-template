import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { getNode } from '@gql/node';
import { createConnection } from 'graphql-sequelize';
import { timestamps } from '../timestamps';
import db from '@database/models';
import { totalConnectionFields } from '@utils/index';
import { getQueryFields, TYPE_ATTRIBUTES } from '@server/utils/gqlFieldUtils';
import { sequelizedWhere } from '@server/database/dbUtils';
import { studentQueries } from '../students';

const { nodeInterface } = getNode();
export const subjectFields = {
  id: { type: GraphQLNonNull(GraphQLID) },
  name: { type: GraphQLString }
};
const Subject = new GraphQLObjectType({
  name: 'Subject',
  interfaces: [nodeInterface],
  fields: () => ({
    ...getQueryFields(subjectFields, TYPE_ATTRIBUTES.isNonNull),
    ...timestamps,
    students: {
      ...studentQueries.list,
      resolve: (source, args, context, info) =>
        studentQueries.list.resolve(source, args, { ...context, subject: source.dataValues }, info)
    }
  })
});

const SubjectConnection = createConnection({
  name: 'subjects',
  target: db.subjects,
  nodeType: Subject,
  before: (findOptions, args, context) => {
    findOptions.include = findOptions.include || [];

    if (context?.student?.id) {
      findOptions.include.push({
        model: db.studentSubjects,
        where: {
          studentId: context.student.id
        }
      });
    }
    findOptions.where = sequelizedWhere(findOptions.where, args.where);
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
