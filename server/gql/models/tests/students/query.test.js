import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { subjectsTable } from '@server/utils/testUtils/mockData';

describe('Student graphQL-server-DB query tests', () => {
  const studentId = 1;
  const studentOne = `
    query {
      student (id: ${studentId}) {
        id
        name
        subjects {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;
  it('should request for subjects related to the students', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.subjects, 'findAll').mockImplementation(() => [subjectsTable[0]]);

    await getResponse(studentOne).then(response => {
      expect(get(response, 'body.data.student')).toBeTruthy();

      expect(dbClient.models.subjects.findAll.mock.calls.length).toBe(1);
      expect(dbClient.models.subjects.findAll.mock.calls[0][0].include[0].where).toEqual({ studentId });
      expect(dbClient.models.subjects.findAll.mock.calls[0][0].include[0].model.name).toEqual('student_subjects');
    });
  });
});
