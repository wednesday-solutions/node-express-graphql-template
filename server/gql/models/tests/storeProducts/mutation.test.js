import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('store_products graphQL-server-DB mutation tests', () => {
  const createStoreProductMut = `
    mutation {
        createStoreproduct (
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

  it('should have a mutation to create a new store product', async done => {
    await getResponse(createStoreProductMut).then(response => {
      const result = get(response, 'body.data.createStoreproduct');
      expect(result).toMatchObject({
        id: '1',
        productId: 1,
        storeId: 1
      });
      done();
    });
  });

  const deleteStoreProductMut = `
  mutation {
    deleteStoreproduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a store product', async done => {
    await getResponse(deleteStoreProductMut).then(response => {
      const result = get(response, 'body.data.deleteStoreproduct');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
      done();
    });
  });
});
