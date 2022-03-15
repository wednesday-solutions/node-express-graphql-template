import { getSingleSupplierId } from '../supplierProducts';

describe('Name of the group', () => {
  it('should return the found value ', async () => {
    const args = {
      productId: 3
    };
    const res = await getSingleSupplierId(args);
    expect(res.product_id).toBe(3);
    expect(res.supplierId).toBe(1);
  });
});
