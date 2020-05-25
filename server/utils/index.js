import isEmpty from 'lodash/isEmpty';

export const addWhereClause = where => {
    if (isEmpty(where)) {
        where += ' WHERE ';
    } else {
        where += ' AND ';
    }
    return where;
};
