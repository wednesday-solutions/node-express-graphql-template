import { pubsub } from '@server/utils/pubsub';
import { iterator, filter } from '../purchasedProductSubsUtil';

describe('Purchased Products subscription utils test', () => {
  describe('iterator tests', () => {
    it('should call the async iterator with the given topic', () => {
      const spy = jest.spyOn(pubsub, 'asyncIterator');
      iterator();
      expect(spy).toBeCalled();
    });
  });
  describe('filter tests', () => {
    it('should return true if the supplierId in payload is equal to supplierId in variables ', () => {
      const payload = {
        notifications: {
          supplierId: 1
        }
      };
      const variables = {
        supplierId: 1
      };
      const res = filter(payload, variables);
      expect(res).toBeTruthy();
    });
  });
});
