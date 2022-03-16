import db from '@database/models';
import {
  insertPurchasedProducts,
  getEarliestCreatedDate,
  getTotalByDate,
  getTotalByDateForCategory,
  getCountByDate,
  getCountByDateForCategory
} from '../purchasedProducts';

describe('purchasedProducts tests', () => {
  const defaultTotalPrice = 500;
  const date = '2022-03-16';
  const category = 'Sports';
  const price = 1122;
  const productId = 133;
  const discount = 111;
  const deliveryDate = '"2022-07-20T17:30:15+05:30"';
  const purchasedProduct = {
    price: price,
    productId: productId,
    discount: discount,
    deliveryDate: deliveryDate
  };

  it('should insert a purchased product and call with correct params', async () => {
    const mock = jest.spyOn(db.purchasedProducts, 'create');
    await insertPurchasedProducts(purchasedProduct);
    expect(mock).toHaveBeenCalledWith(purchasedProduct);
  });

  describe('earliestCreatedDate tests', () => {
    it('should return the earliest created purchasedProduct ', async () => {
      db.purchasedProducts.findOne = jest.fn().mockImplementationOnce(() => ({
        createdAt: new Date()
      }));
      const res = await getEarliestCreatedDate();
      expect(res).toEqual(new Date().toISOString().split('T')[0]);
    });
  });
  describe('getTotalByDate tests', () => {
    it('should return the total of price for a particular provided date', async () => {
      db.purchasedProducts.sum = jest.fn().mockReturnValueOnce(defaultTotalPrice);
      const res = await getTotalByDate(date);
      expect(res).toEqual(defaultTotalPrice);
    });
  });
  describe('getTotalByDateForCategory tests', () => {
    it('should return the total for a particular category on a provided date', async () => {
      db.purchasedProducts.sum = jest.fn().mockReturnValueOnce(defaultTotalPrice);
      const res = await getTotalByDateForCategory(date, category);
      expect(res).toEqual(defaultTotalPrice);
    });
  });
  describe('getCountByDate tests', () => {
    const mockValue = 1;
    it('should return count by date', async () => {
      db.purchasedProducts.count = jest.fn().mockImplementationOnce(() => mockValue);
      const res = await getCountByDate(date);
      expect(res).toBe(mockValue);
    });
  });
  describe('getCountByDateForCategory', () => {
    const mockValue = [{ count: 1 }];
    it('should return the count for category for a particular date', async () => {
      db.purchasedProducts.count = jest.fn().mockReturnValueOnce(mockValue);
      const res = await getCountByDateForCategory(date, category);
      expect(res).toEqual(1);
    });
  });
});
