import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('purchased_products graphQL-server-DB mutation tests', () => {
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
