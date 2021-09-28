import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('supplier_product graphQL-server-DB mutation tests', () => {
  const createSupplierProductMut = `
    mutation {
      createSupplierProduct (
        productId: 1
        supplierId: 1
      ) {
        id
        productId
        supplierId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;

  it('should have a mutation to create a new supplier Product', async () => {
    await getResponse(createSupplierProductMut).then(response => {
      const result = get(response, 'body.data.createSupplierProduct');
      expect(result).toMatchObject({
        id: '1',
        productId: 1,
        supplierId: 1
      });
    });
  });

  const deleteSupplierProductMut = `
  mutation {
    deleteSupplierProduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a supplier product', async () => {
    await getResponse(deleteSupplierProductMut).then(response => {
      const result = get(response, 'body.data.deleteSupplierProduct');

      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
    });
  });
});
