import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('supplier graphQL-server-DB mutation tests', () => {
  const createSupplierMut = `
    mutation {
      createSupplier (
        name: "new supplier name"
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

  it('should have a mutation to create a new supplier', async () => {
    await getResponse(createSupplierMut).then(response => {
      const result = get(response, 'body.data.createSupplier');
      expect(result).toMatchObject({
        id: '1',
        name: 'new supplier name',
        addressId: 1
      });
    });
  });

  const deleteSupplierMut = `
  mutation {
    deleteSupplier (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a supplier', async () => {
    await getResponse(deleteSupplierMut).then(response => {
      const result = get(response, 'body.data.deleteSupplier');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
    });
  });
});
