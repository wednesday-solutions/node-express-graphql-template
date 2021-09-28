import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('store graphQL-server-DB mutation tests', () => {
  const createStoreMut = `
    mutation {
        createStore (
        name: "new store name"
        addressId: 1
      ) {
        id
        name
        addressId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new store', async () => {
    await getResponse(createStoreMut).then(response => {
      const result = get(response, 'body.data.createStore');
      expect(result).toMatchObject({
        id: '1',
        name: 'new store name',
        addressId: 1
      });
    });
  });

  const deleteStoreMut = `
  mutation {
    deleteStore (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a store', async () => {
    await getResponse(deleteStoreMut).then(response => {
      const result = get(response, 'body.data.deleteStore');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
    });
  });
});
