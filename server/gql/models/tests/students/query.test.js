import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';

describe('Student graphQL-server-DB query tests', () => {
  const id = 1;
  const studentOne = `
    query {
      student (id: ${id}) {
        id
        name
      }
    }
  `;
  it('should request for students', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    await getResponse(studentOne).then(response => {
      expect(get(response, 'body.data.student')).toBeTruthy();
    });
  });
});
