import isEmpty from 'lodash/isEmpty';
import { GraphQLInt, GraphQLNonNull } from 'graphql';

export const isTestEnv = () => process.env.ENVIRONMENT === 'test';
export const addWhereClause = (where, clause) => {
  if (isEmpty(where)) {
    where += ' WHERE (';
  } else {
    where += ' AND (';
  }
  return ` ${where} ${clause} ) `;
};

export const addWhereClauseToAliasTable = (aliasTable, where, queryTerm, arg) => {
  if (aliasTable.name === queryTerm.split('.')[0] && aliasTable.type === 'table') {
    if (arg) {
      where = addWhereClause(where, `${queryTerm} = ${arg}`);
    }
  }
  return where;
};

export const totalConnectionFields = {
  connectionFields: {
    total: {
      resolve: meta => meta.fullCount,
      type: GraphQLNonNull(GraphQLInt)
    }
  }
};
