import get from 'lodash/get';
import { getResponse, resetAndMockDB } from '@server/utils/testUtils';
import { studentSubjectsTable } from '@server/utils/testUtils/mockData';

describe('studentSubjects graphQL-server-DB mutation tests', () => {
  const studentSubjectsQuery = `
  query {
    studentSubjects (first: 1, limit: 1, offset: 0){
      edges {
        node {
          id
          studentId
          subjectId
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
    await getResponse(studentSubjectsQuery).then(response => {
      const result = get(response, 'body.data.studentSubjects.edges[0].node');
      expect(result).toEqual(
        expect.objectContaining({
          id: studentSubjectsTable[0].id
        })
      );
    });
  });
  it('should have the correct pageInfo', async () => {
    await getResponse(studentSubjectsQuery).then(response => {
      const result = get(response, 'body.data.studentSubjects.pageInfo');
      expect(result).toEqual(
        expect.objectContaining({
          hasNextPage: true,
          hasPreviousPage: false
        })
      );
    });
  });
});
