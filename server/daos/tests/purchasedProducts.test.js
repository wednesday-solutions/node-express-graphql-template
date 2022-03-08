import db from '@database/models';
import { insertPurchasedProducts } from '../purchasedProducts';

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
  it('should throw error if the create new record fails', async () => {
    jest
      .spyOn(db.purchasedProducts, 'create')
      .mockImplementation(() => new Promise((resolve, reject) => reject(new Error())));
    const res = await insertPurchasedProducts(purchasedProduct);
    expect(res).toEqual('Error while adding purchased products');
  });
});
