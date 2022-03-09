import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';
import * as customMutations from '../../purchasedProducts/customMutations';

describe('purchased_products graphQL-server-DB mutation tests', () => {
  const createPurchasedProductMutation = `
    mutation {
      createPurchasedProduct (
        price: 100
        discount: 10,
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

  it('should have a mutation to create a new purchased product', async () => {
    const spy = jest.spyOn(customMutations, 'customCreateResolver');
    await getResponse(createPurchasedProductMutation);
    expect(spy).toBeCalled();
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

  it('should have a mutation to delete a purchased product', async () => {
    await getResponse(deletePurchasedProductMut).then(response => {
      const result = get(response, 'body.data.deletePurchasedProduct');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
    });
  });
});
