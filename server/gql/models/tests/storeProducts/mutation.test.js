import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('store_products graphQL-server-DB mutation tests', () => {
  const createStoreProductMut = `
    mutation {
        createStoreProduct (
        productId: 1
        storeId: 1
      ) {
        id
        productId
        storeId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new store product', async () => {
    await getResponse(createStoreProductMut).then(response => {
      const result = get(response, 'body.data.createStoreProduct');
      expect(result).toMatchObject({
        id: '1',
        productId: 1,
        storeId: 1
      });
    });
  });

  const deleteStoreProductMut = `
  mutation {
    deleteStoreProduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a store product', async () => {
    await getResponse(deleteStoreProductMut).then(response => {
      const result = get(response, 'body.data.deleteStoreProduct');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
    });
  });
});
