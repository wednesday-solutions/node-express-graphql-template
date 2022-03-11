import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { GraphQLNonNull } from 'graphql';
export const TYPE_ATTRIBUTES = {
  isNonNull: 'isNonNull',
  isCreateRequired: 'isCreateRequired',
  isUpdateRequired: 'isUpdateRequired'
};

export const CREATE_AND_QUERY_REQUIRED_ARGS = {
  [TYPE_ATTRIBUTES.isNonNull]: true,
  [TYPE_ATTRIBUTES.isCreateRequired]: true
};
export const getQueryFields = (fields, keyToCheck) => {
  const fieldsClone = cloneDeep(fields);
  Object.keys(fieldsClone).forEach(key => {
    if (get(fieldsClone, `${key}.${keyToCheck}`)) {
      fieldsClone[key].type = GraphQLNonNull(fieldsClone[key].type);
    }
  });
  return fieldsClone;
};
