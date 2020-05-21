import { isArray, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep';

export const convertDbResponseToRawResponse = dbResponse =>
    dbResponse.get({
        plain: true,
        raw: true
    });

/**
 * A funtion that takes an sequelize database array response and converts
 * each object in a raw object & the keys to be snake_case
 * @param {Object} array
 */
export const transformDbArrayResponseToRawResponse = array => {
    if (!isArray(array)) {
        throw new Error('The required type should be an object(array)');
    } else {
        return array.map(resource =>
            mapKeysDeep(convertDbResponseToRawResponse(resource), keys =>
                snakeCase(keys)
            )
        );
    }
};
