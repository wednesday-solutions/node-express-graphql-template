import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@server/utils/testUtils';
import { studentsTable } from '@server/utils/testUtils/mockData';

describe('Subject graphQL-server-DB query tests', () => {
  const subjectId = 1;
  const subjectOne = `
    query {
      subject (id: ${subjectId}) {
        id
        name
        students {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;
  it('should request for subjects', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.students, 'findAll').mockImplementation(() => [studentsTable[0]]);

    await getResponse(subjectOne).then(response => {
      expect(get(response, 'body.data.subject')).toBeTruthy();

      expect(dbClient.models.students.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.students.findAll.mock.calls[0][0].include[0].where).toEqual({ subjectId });
      expect(dbClient.models.students.findAll.mock.calls[0][0].include[0].model.name).toEqual('student_subjects');
    });
  });
});
