import { transformDbArrayResponseToRawResponse, convertDbResponseToRawResponse } from '../transformerUtils';

describe('transformerUtils tests', () => {
  const response = [
    {
      products: {
        dataValues: {
          category: 'Shoes'
        }
      },
      get: () => 'Shoes'
    },
    {
      products: {
        dataValues: {
          category: 'Health'
        }
      },
      get: () => 'Health'
    }
  ];
  it('should transform the array response to raw response ', () => {
    const { transformDbArrayResponseToRawResponse } = require('../transformerUtils');
    const res = transformDbArrayResponseToRawResponse(response);
    expect(res).toEqual([response[0].products.dataValues.category, response[1].products.dataValues.category]);
  });
  it('should throw error if the response passed in argument is not an object', () => {
    expect(transformDbArrayResponseToRawResponse).toThrowError('The required type should be an object(array)');
  });

  describe('convertDbResponseToRawResponse tests', () => {
    it('should call the get method on the response', () => {
      const res = convertDbResponseToRawResponse(response[0]);
      expect(res).toEqual(response[0].products.dataValues.category);
    });
  });
});
