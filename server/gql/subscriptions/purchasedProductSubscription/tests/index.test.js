import { getResponse } from '@utils/testUtils';
import * as module from 'graphql-subscriptions';
import { iterator, filter } from '../purchasedProductSubsUtil';
import '@utils/pubsub';

describe('Subscription tests', () => {
  it('should add a subscription', async () => {
    const subscription = `
    subscription Subscription{
        notifications(supplierId: 1671) {
          price
          supplierId
          deliveryDate
          productId
        }
      }
  `;
    const spy = jest.spyOn(module, 'withFilter');
    await getResponse(subscription);
    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith(iterator, filter);
  });
});
