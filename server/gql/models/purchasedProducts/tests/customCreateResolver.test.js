import { getResponse } from '@utils/testUtils';
import { updateRedis } from '@gql/models/purchasedProducts/customCreateResolver';
import { redis } from '@services/redis';
import moment from 'moment';

describe('custom resolver tests', () => {
  const createQuery = `
  mutation {
    createPurchasedProduct (
      price: 123321,
      discount: 121,
      productId: 1876,
      deliveryDate: "2016-07-20T17:30:15+05:30",
      storeId: 1
    ) {
      id
      price
    }
  }
`;
  const res = {
    discount: 121,
    deliveryDate: '2016-07-20T12:00:15.000Z',
    productId: 1,
    id: 1,
    price: 123,
    storeId: 1
  };
  it('should should set the values of the response in redis store', async () => {
    const spy = jest.spyOn(redis, 'set');
    await updateRedis(res);
    expect(spy).toBeCalledTimes(2);
    expect(spy.mock.calls[1]).toMatchObject([`${moment().format('YYYY-MM-DD')}_total`, '{"total":123,"count":1}']);
  });
  it('should create a new row in purchased Products', async () => {
    const customCreateResolver = require(`../customCreateResolver`);
    const spy = jest.spyOn(customCreateResolver, 'default');
    await getResponse(createQuery);
    expect(spy).toBeCalled();
  });
  it('should throw custom error when there is error in creatingPurchasedProducts ', async () => {
    const purchasedProducts = require('@daos/purchasedProducts');
    const utils = require('@utils');
    jest.spyOn(purchasedProducts, 'insertPurchasedProducts').mockImplementation(() => {
      throw new Error();
    });
    const throwSpy = jest.spyOn(utils, 'transformSQLError');
    await getResponse(createQuery);
    expect(throwSpy).toBeCalled();
  });
});
