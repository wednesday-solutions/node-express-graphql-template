import { getResponse } from '@utils/testUtils';
import { redis } from '@services/redis';
import moment from 'moment';
import { customCreateResolver } from '@server/gql/models/purchasedProducts/customCreateResolver';

describe('custom Mutation tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  const createQuery = `
  mutation {
    createPurchasedProduct (
      price: 100
      discount: 10,
      productId: 1
    ) {
      id
      price
      discount
      deliveryDate
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
  it('should should set the values of the response in redis store', async () => {
    const mock = jest.spyOn(redis, 'set');
    await getResponse(createQuery);
    expect(mock).toBeCalledTimes(2);
    expect(mock.mock.calls[1]).toMatchObject([`${moment().format('YYYY-MM-DD')}_total`, '{"total":100,"count":1}']);
  });
  it('should create a new row in purchased Products', async () => {
    const customMutations = require(`../customCreateResolver`);
    const spy = jest.spyOn(customMutations, 'customCreateResolver');

    await getResponse(createQuery);
    expect(spy).toBeCalled();
  });
  it('should ', async () => {
    jest.spyOn(customCreateResolver(), 'createResolver').mockImplementation(() => {});
    const resolver = await customCreateResolver().createResolver;
    console.log(resolver);
    await expect(resolver()).rejects.toBe();
  });
});
