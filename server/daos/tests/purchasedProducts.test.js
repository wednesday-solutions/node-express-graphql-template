import db from '@database/models';
import { insertPurchasedProducts, getEarliestCreatedDate, getCategoryById } from '../purchasedProducts';

describe('purchasedProducts tests', () => {
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

  describe('Queries tests', () => {
    it('should return the earliest created purchasedProduct ', async () => {
      const res = await getEarliestCreatedDate();
      expect(res.getDate()).toEqual(new Date().getDate());
    });
  });

  it('should return the product category if Id is provided', async () => {
    const res = await getCategoryById(productId);
    expect(res).toEqual('Sports');
  });
});
