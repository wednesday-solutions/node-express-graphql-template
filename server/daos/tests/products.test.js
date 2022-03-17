const { redis } = require('@server/services/redis');
const { getCategoryById, getAllCategories } = require('../products');

describe('Products dao tests', () => {
  it('should return the product category if Id is provided', async () => {
    const productId = 133;
    const res = await getCategoryById(productId);
    expect(res).toEqual('Sports');
  });
  describe('getAllCategories tests', () => {
    const categories = ['Tools', 'Electronics', 'Sports', 'Books', 'Clothing', 'Kids', 'Music'];
    const mockCategoriesValue = ['Sports'];
    it('should return the categories data from redis', async () => {
      jest.spyOn(redis, 'get').mockReturnValueOnce(JSON.stringify(categories));
      const res = await getAllCategories();
      expect(res).toEqual(categories);
    });
    it('should return the categories data from database if not present in redis', async () => {
      jest.spyOn(redis, 'get').mockReturnValueOnce(NaN);
      const res = await getAllCategories();
      expect(res).toEqual(mockCategoriesValue);
    });
  });
});
