import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@server/utils/testUtils';

describe('Subject graphQL-server-DB query tests', () => {
  const id = 1;
  const subjectQuery = `
    query {
      subject (id: ${id}) {
        id
        name
      }
    }
  `;
  it('should request for subjects', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(subjectQuery).then(response => {
      expect(get(response, 'body.data.subject')).toBeTruthy();
    });
  });
});
