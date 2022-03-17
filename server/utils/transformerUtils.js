import { isArray, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep';

export const convertDbResponseToRawResponse = dbResponse =>
  dbResponse.get({
    plain: true,
    raw: true
  });

export const transformDbArrayResponseToRawResponse = arr => {
  if (!isArray(arr)) {
    throw new Error('The required type should be an object(array)');
  } else {
    return arr.map(resource => mapKeysDeep(convertDbResponseToRawResponse(resource), keys => snakeCase(keys)));
  }
};
