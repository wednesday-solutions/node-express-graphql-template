import get from 'lodash/get';
import { getResponse, resetAndMockDB } from '@server/utils/testUtils';
import { subjectsTable } from '@server/utils/testUtils/mockData';

describe('Subject graphQL-server-DB mutation tests', () => {
  const subjectsQuery = `
  query {
    subjects (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          name
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
  it('should have a query to get the subjects', async () => {
    resetAndMockDB(null, {});
    await getResponse(subjectsQuery).then(response => {
      const result = get(response, 'body.data.subjects.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: subjectsTable[0].id,
          name: subjectsTable[0].name
        })
      );
    });
  });
  it('should have the correct page info', async () => {
    await getResponse(subjectsQuery).then(response => {
      const result = get(response, 'body.data.subjects.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
  });
});
