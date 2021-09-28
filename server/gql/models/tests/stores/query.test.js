import get from 'lodash/get';
import { productsTable } from '@server/utils/testUtils/mockData';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('store graphQL-server-DB query tests', () => {
  const id = '1';
  const storeName = `
  query {
    store (id: ${id}) {
      id
      name
      products {
        edges {
          node {
            id
          }
        }
      }
    }
  }
  `;

  it('should request for products related to the stores', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.products, 'findAll').mockImplementation(() => [productsTable[0]]);

    await getResponse(storeName).then(response => {
      expect(get(response, 'body.data.store')).toBeTruthy();

      expect(dbClient.models.products.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].where).toEqual({ id });
      expect(dbClient.models.products.findAll.mock.calls[0][0].include[0].model.name).toEqual('stores');
    });
  });
});
