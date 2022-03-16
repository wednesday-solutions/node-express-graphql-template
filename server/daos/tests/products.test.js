const { getCategoryById } = require('../products');

describe('Products dao tests', () => {
  it('should return the product category if Id is provided', async () => {
    const productId = 133;
    const res = await getCategoryById(productId);
    expect(res).toEqual('Sports');
  });
});
