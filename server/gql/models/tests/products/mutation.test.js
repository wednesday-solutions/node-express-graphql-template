import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Product graphQL-server-DB mutation tests', () => {
  const createProductMut = `
    mutation {
      createProduct (
        name: "New produce"
        amount: 10
      ) {
        id
        name
        amount
        createdAt
        updatedAt
        deletedAt
        suppliers {
          edges {
            node {
              id
            }  
          }
        }
        stores {
          edges {
            node {
              id
            }  
          }
        }
      }
    }
  `;

  it('should have a mutation to create a new product', async done => {
    await getResponse(createProductMut).then(response => {
      const result = get(response, 'body.data.createProduct');
      expect(result).toMatchObject({
        id: '1',
        name: 'New produce',
        amount: 10
      });
      done();
    });
  });

  const deleteProductMut = `
  mutation {
    deleteProduct (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a product', async done => {
    await getResponse(deleteProductMut).then(response => {
      const result = get(response, 'body.data.deleteProduct');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
      done();
    });
  });
});
