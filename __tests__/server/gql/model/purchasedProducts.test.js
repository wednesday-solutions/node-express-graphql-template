const { closeRedisConnection } = require('@server/services/redis');
const { getMockDBEnv, getResponse } = require('@server/utils/testUtils');
const { get } = require('lodash');

function getPurchasedProductsQueryWithParams(
  limit,
  offset,
  fields = ['id', 'price', 'discount', 'deliveryDate', 'productId', 'storeId']
) {
  return `
  query Query {
    purchasedProducts(limit: ${limit}, offset: ${offset}) {
      edges {
        node {
          ${fields.map(item => item)},
          createdAt
          updatedAt
          deletedAt
          products {
            edges {
              node {
                id
                name
                category
                amount
              }
            }
          }
        }
      }
    }
  }
  `;
}

describe('Integration test for purchasedProduct query', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.unmock('@database');
    jest.unmock('@database/models');
    jest.unmock('ioredis');
    process.env = { ...OLD_ENV };
    process.env = { ...process.env, ...getMockDBEnv(), REDIS_PORT: 6380 };
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    await closeRedisConnection(); // avoid jest open handle error
  });

  it('Should fetch purchased products with given limit and offset', async () => {
    const limit = 10;
    const offset = 0;
    const response = await getResponse(getPurchasedProductsQueryWithParams(limit, offset));

    const purchasedProducts = get(response, 'body.data.purchasedProducts.edges');
    // Perform assertions based on the response
    expect(purchasedProducts).toBeTruthy();
    expect(purchasedProducts.length).toBeGreaterThan(0);
    expect(purchasedProducts.length).toBe(limit);

    const firstProduct = purchasedProducts[0].node;

    // Purchase details
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('discount');
    expect(firstProduct).toHaveProperty('deliveryDate');
    expect(firstProduct).toHaveProperty('productId');
    expect(firstProduct).toHaveProperty('storeId');
    expect(firstProduct).toHaveProperty('createdAt');
    expect(firstProduct).toHaveProperty('updatedAt');
    expect(firstProduct).toHaveProperty('deletedAt');
    expect(firstProduct).toHaveProperty('products');
    expect(firstProduct.price).toBe(808);
    expect(firstProduct.productId).toBe('1');
    expect(firstProduct.discount).toBe(100);
    expect(firstProduct.storeId).toBe('1');
    expect(firstProduct.deliveryDate).toBe('2024-01-12T06:49:10.749Z');
    expect(firstProduct.createdAt).toBe('1994-10-24T06:49:10.749Z');

    // First product details
    const productsDetails = get(firstProduct, 'products.edges');
    expect(productsDetails.length).toBe(1);

    const firstProductDetails = productsDetails[0].node;
    expect(firstProductDetails.id).toBe('1');
    expect(firstProductDetails.name).toBe('test1');
    expect(firstProductDetails.category).toBe('category1');
    expect(firstProductDetails.amount).toBe(10);
  });

  it('Should fetch purchased products with given updated limit and offset', async () => {
    const limit = 5;
    const offset = 10;
    const response = await getResponse(getPurchasedProductsQueryWithParams(limit, offset));

    const purchasedProducts = get(response, 'body.data.purchasedProducts.edges');
    // Perform assertions based on the response
    expect(purchasedProducts).toBeTruthy();
    expect(purchasedProducts.length).toBeGreaterThan(0);
    expect(purchasedProducts.length).toBe(limit);

    const firstProduct = purchasedProducts[0].node;
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('discount');
    expect(firstProduct).toHaveProperty('deliveryDate');
    expect(firstProduct).toHaveProperty('productId');
    expect(firstProduct).toHaveProperty('storeId');
    expect(firstProduct).toHaveProperty('createdAt');
    expect(firstProduct).toHaveProperty('updatedAt');
    expect(firstProduct).toHaveProperty('deletedAt');
    expect(firstProduct.id).toBe(`${offset + 1}`);

    // First product details
    const productsDetails = get(firstProduct, 'products.edges');
    expect(productsDetails.length).toBe(1);

    const firstProductDetails = productsDetails[0].node;
    expect(firstProductDetails).toHaveProperty('id');
    expect(firstProductDetails).toHaveProperty('name');
    expect(firstProductDetails).toHaveProperty('category');
    expect(firstProductDetails).toHaveProperty('amount');
  });

  it('Should fetch users with only firstName and lastName field', async () => {
    const limit = 5;
    const offset = 10;
    const response = await getResponse(getPurchasedProductsQueryWithParams(limit, offset, ['id', 'price']));

    const purchasedProducts = get(response, 'body.data.purchasedProducts.edges');
    // Perform assertions based on the response
    expect(purchasedProducts).toBeTruthy();
    expect(purchasedProducts.length).toBeGreaterThan(0);
    expect(purchasedProducts.length).toBe(limit);

    const firstProduct = purchasedProducts[0].node;
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).not.toHaveProperty('discount');
    expect(firstProduct).not.toHaveProperty('deliveryDate');
    expect(firstProduct).not.toHaveProperty('productId');
    expect(firstProduct).not.toHaveProperty('storeId');
    expect(firstProduct).toHaveProperty('createdAt');
    expect(firstProduct).toHaveProperty('updatedAt');
    expect(firstProduct).toHaveProperty('deletedAt');
    expect(firstProduct.id).toBe(`${offset + 1}`);

    // First product details
    const productsDetails = get(firstProduct, 'products.edges');
    expect(productsDetails.length).toBe(1);

    const firstProductDetails = productsDetails[0].node;
    expect(firstProductDetails).toHaveProperty('id');
    expect(firstProductDetails).toHaveProperty('name');
    expect(firstProductDetails).toHaveProperty('category');
    expect(firstProductDetails).toHaveProperty('amount');
  });
});
