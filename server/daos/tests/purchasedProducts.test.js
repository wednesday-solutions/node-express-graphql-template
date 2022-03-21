import db from '@database/models';
import moment from 'moment';
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
  const date = moment('2022-03-16');
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
      const res = await getEarliestCreatedDate();
      expect(res).toEqual(new Date().toISOString().split('T')[0]);
    });
  });
  describe('getTotalByDate tests', () => {
    it('should return the total of price for a particular provided date', async () => {
      const res = await getTotalByDate(date);
      expect(res).toEqual(defaultTotalPrice);
    });
    it('should return zero if there is no value present for the date', async () => {
      jest.spyOn(db.purchasedProducts, 'sum').mockReturnValueOnce(NaN);
      const mockDate = moment('2022-01-03');
      const res = await getTotalByDate(mockDate);
      expect(res).toEqual(0);
    });
  });
  describe('getTotalByDateForCategory tests', () => {
    it('should return the total for a particular category on a provided date', async () => {
      jest.spyOn(db.purchasedProducts, 'sum').mockReturnValueOnce(defaultTotalPrice);
      const res = await getTotalByDateForCategory(date, category);
      expect(res).toEqual(defaultTotalPrice);
    });
    it('should return zero if there is no value present for the date', async () => {
      jest.spyOn(db.purchasedProducts, 'sum').mockReturnValueOnce(NaN);
      const mockDate = moment('2022-01-03');
      const res = await getTotalByDateForCategory(mockDate);
      expect(res).toEqual(0);
    });
  });
  describe('getCountByDate tests', () => {
    const mockValue = 1;
    it('should return count by date', async () => {
      db.purchasedProducts.count = jest.fn().mockImplementationOnce(() => mockValue);
      const res = await getCountByDate(date);
      expect(res).toBe(mockValue);
    });
    it('should return zero if there is no count present for the date', async () => {
      db.purchasedProducts.count = jest.fn().mockImplementationOnce(() => 0);
      const mockDate = moment('2022-01-03');
      const res = await getCountByDate(mockDate);
      expect(res).toEqual(0);
    });
  });
  describe('getCountByDateForCategory', () => {
    const mockValue = [{ count: 1 }];
    it('should return the count for category for a particular date', async () => {
      db.purchasedProducts.count = jest.fn().mockReturnValueOnce(mockValue);
      const res = await getCountByDateForCategory(date, category);
      expect(res).toEqual(1);
    });
    it('should return zero if there is no count present for the date for the category', async () => {
      db.purchasedProducts.count = jest.fn().mockImplementationOnce(() => NaN);
      const mockDate = moment('2022-01-03');
      const res = await getCountByDateForCategory(mockDate);
      expect(res).toEqual(0);
    });
  });
});
