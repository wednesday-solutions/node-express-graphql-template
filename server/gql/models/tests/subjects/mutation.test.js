import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@server/utils/testUtils';
import { subjectsTable } from '@server/utils/testUtils/mockData';

describe('Subject graphQL-server-DB mutation tests', () => {
  let dbClient;
  beforeEach(() => {
    dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
  });
  const createSubjectMutation = `
    mutation {
      createSubject (
        name: "${subjectsTable[0].name}"
      ) {
        id
        name
        createdAt
        updatedAt
        deletedAt
      }
    }
  `;
  const updateSubjectMutation = `
    mutation {
      updateSubject (
        id: ${subjectsTable[0].id},
        name: "${subjectsTable[0].name}",
      ) {
        id
      }
    }
  `;
  const deleteSubjectMutation = `
    mutation {
      deleteSubject (
        id: ${subjectsTable[0].id}
      ) {
        id
      }
    }
  `;
  it('should have a mutation to create a new subject', async () => {
    jest.spyOn(dbClient.models.subjects, 'create');
    const response = await getResponse(createSubjectMutation);
    const result = get(response, 'body.data.createSubject');
    expect(result).toBeTruthy();
    const { id, ...subject } = subjectsTable[0];
    expect(dbClient.models.subjects.create.mock.calls.length).toBe(1);
    expect(dbClient.models.subjects.create.mock.calls[0][0]).toEqual({
      ...subject
    });
  });
  it('should have a mutation to update a new subject', async () => {
    jest.spyOn(dbClient.models.subjects, 'update');
    const response = await getResponse(updateSubjectMutation);
    const result = get(response, 'body.data.updateSubject');
    expect(result).toBeTruthy();
    expect(dbClient.models.subjects.update.mock.calls.length).toBe(1);
    console.log(dbClient.models.subjects.update.mock.calls[0][0]);
    expect(dbClient.models.subjects.update.mock.calls[0][0]).toEqual({
      id: subjectsTable[0].id.toString(),
      name: subjectsTable[0].name
    });
    expect(dbClient.models.subjects.update.mock.calls[0][1]).toEqual({
      where: {
        id: subjectsTable[0].id.toString(),
        deletedAt: null
      }
    });
  });
  it('should have a mutation to delete a subject', async () => {
    jest.spyOn(dbClient.models.subjects, 'destroy');
    const response = await getResponse(deleteSubjectMutation);
    const result = get(response, 'body.data.deleteSubject');
    expect(result).toBeTruthy();
    expect(dbClient.models.subjects.destroy.mock.calls.length).toBe(1);
    expect(dbClient.models.subjects.destroy.mock.calls[0][0]).toEqual({
      where: {
        deletedAt: null,
        id: parseInt(subjectsTable[0].id)
      }
    });
  });
});
