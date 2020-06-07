import isEmpty from 'lodash/isEmpty';

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
