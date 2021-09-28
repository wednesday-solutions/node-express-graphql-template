import get from 'lodash/get';
import { getResponse, resetAndMockDB } from '@server/utils/testUtils';
import { addressesTable } from '@server/utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
  const addressesQuery = `
  query {
    addresses (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          address1
          address2
          stores {
            edges {
              node {
                id 
              }
            }
          }
          suppliers {
            edges {
              node {
                id 
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      total
    }
  }
`;

  it('should have a query to get the addresses', async () => {
    resetAndMockDB(null, {});
    await getResponse(addressesQuery).then(response => {
      const result = get(response, 'body.data.addresses.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: addressesTable[0].id,
          address1: addressesTable[0].address1,
          address2: addressesTable[0].address2
        })
      );
    });
  });
  it('should have the correct pageInfo', async () => {
    await getResponse(addressesQuery).then(response => {
      const result = get(response, 'body.data.addresses.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
  });
});
