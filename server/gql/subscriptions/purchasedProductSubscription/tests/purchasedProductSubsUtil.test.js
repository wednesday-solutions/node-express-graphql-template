import { SUBSCRIPTION_TOPICS } from '@server/utils/constants';
import { pubsub } from '@server/utils/pubsub';
import { getAsyncInterator, getFilteredSubscription } from '../purchasedProductSubsUtil';

describe('Purchased Products subscription utils test', () => {
  describe('getAsyncInterator tests', () => {
    it('should call the async iterator with the given topic', () => {
      const spy = jest.spyOn(pubsub, 'asyncIterator');
      getAsyncInterator(SUBSCRIPTION_TOPICS.NOTIFICATIONS)();
      expect(spy).toBeCalled();
    });
  });
  describe('getFilteredSubscription tests', () => {
    it('should return true if the supplierId in payload is equal to supplierId in variables ', () => {
      const payload = {
        notifications: {
          storeId: 1
        }
      };
      const variables = {
        storeId: 1
      };
      const res = getFilteredSubscription(payload, variables);
      expect(res).toBeTruthy();
    });
  });
});
