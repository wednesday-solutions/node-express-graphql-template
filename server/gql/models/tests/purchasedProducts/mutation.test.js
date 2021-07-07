import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('purchased_products graphQL-server-DB mutation tests', () => {
  const createPurchasedProductMutation = `
    mutation {
      createPurchasedProduct (
        price: 100
        discount: 10
        deliveryDate: "2363-01-30T10:05:32.880Z"
        productId: 1 
      ) {
        id
        price
        discount
        deliveryDate
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new purchased product', async done => {
    await getResponse(createPurchasedProductMutation).then(response => {
      const result = get(response, 'body.data.createPurchasedProduct');
      expect(result).toMatchObject({
        id: '1',
        price: 100,
        discount: 10,
        deliveryDate: '2363-01-30T10:05:32.880Z'
      });
      done();
    });
  });

  const deletePurchasedProductMut = `
  mutation {
    deletePurchasedProduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a purchased product', async done => {
    await getResponse(deletePurchasedProductMut).then(response => {
      const result = get(response, 'body.data.deletePurchasedProduct');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
      done();
    });
  });
});
