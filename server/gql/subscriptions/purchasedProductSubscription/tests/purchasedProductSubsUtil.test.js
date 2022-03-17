import { checkFilterCondition } from '../purchasedProductSubsUtil';

describe('Purchased Products subscription utils test', () => {
  describe('getFilteredSubscription tests', () => {
    it('should return true if the supplierId in payload is equal to supplierId in variables ', () => {
      const payload = {
        newPurchasedProduct: {
          storeId: 1
        }
      };
      const variables = {
        storeId: 1
      };
      const res = checkFilterCondition(payload, variables);
      expect(res).toBeTruthy();
    });
  });
});
