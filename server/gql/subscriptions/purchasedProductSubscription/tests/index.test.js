import { getResponse } from '@utils/testUtils';
import { checkFilterCondition } from '../purchasedProductSubsUtil';
import * as module from 'graphql-subscriptions';

describe('Subscription tests', () => {
  it('should add a subscription', async () => {
    const subscription = `
    subscription Subscription{
        newPurchasedProduct(supplierId: 1671) {
          price
          supplierId
          deliveryDate
          productId
        }
      }
  `;
    const spy = jest.spyOn(module, 'withFilter');
    await getResponse(subscription);
    expect(spy).toBeCalledWith(expect.any(Function), checkFilterCondition);
  });
});
