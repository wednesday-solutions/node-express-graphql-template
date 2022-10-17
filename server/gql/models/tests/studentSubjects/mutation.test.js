import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { studentSubjectsTable } from '@server/utils/testUtils/mockData';

describe('student_subjects graphQL-server-DB mutation tests', () => {
  const createStudentSubjectMut = `
    mutation {
        createStudentSubject (
        studentId: 1
        subjectId: 1
      ) {
        id
        studentId
        subjectId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;
  it('should have a mutation to create a new student subject', async () => {
    await getResponse(createStudentSubjectMut).then(response => {
      const result = get(response, 'body.data.createStudentSubject');
      expect(result).toMatchObject({
        id: '1',
        studentId: '1',
        subjectId: '1'
      });
    });
  });

  const deleteStudentSubjectMut = `
  mutation {
    deleteStudentSubject (
        id: 1
    ) {
      id
    }
  }
`;

  it('should have a mutation to delete a student subject', async () => {
    await getResponse(deleteStudentSubjectMut).then(response => {
      const result = get(response, 'body.data.deleteStudentSubject');
      expect(result).toEqual(
        expect.objectContaining({
          id: 1
        })
      );
    });
  });
  let dbClient;
  beforeEach(() => {
    dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
  });
  const updateStudentSubjectMut = `
  mutation {
    updateStudentSubject (
      id: ${studentSubjectsTable[0].id}
      studentId: ${studentSubjectsTable[0].studentId}
      subjectId: ${studentSubjectsTable[0].subjectId}
    ) {
      id
    }
  }
`;
  it('should have a mutation to update a new student subject', async () => {
    jest.spyOn(dbClient.models.studentSubjects, 'update');
    const response = await getResponse(updateStudentSubjectMut);
    const result = get(response, 'body.data.updateStudentSubject');
    expect(result).toBeTruthy();
    expect(dbClient.models.studentSubjects.update.mock.calls.length).toBe(1);
    expect(dbClient.models.studentSubjects.update.mock.calls[0][0]).toEqual({
      id: studentSubjectsTable[0].id.toString(),
      studentId: studentSubjectsTable[0].studentId.toString(),
      subjectId: studentSubjectsTable[0].subjectId.toString()
    });
    expect(dbClient.models.studentSubjects.update.mock.calls[0][1]).toEqual({
      where: {
        id: studentSubjectsTable[0].id.toString(),
        deletedAt: null
      }
    });
  });
});
