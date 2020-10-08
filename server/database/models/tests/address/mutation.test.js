import get from 'lodash/get';
import { mockQueryResults } from 'server/utils/testUtils';
import { testApp } from 'server/utils/testUtils/testApp';
var request = require('supertest');

beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  client.$queueQueryResult([{}, { rows: [{ ...mockQueryResults.addressesTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('Address graphQL-server-DB mutation tests', () => {
  const createAddressMut = `
  mutation {
    createAddress (
      address1: "new address one"
      address2: "new address two"
      city: "new city"
      country: "new country"
      lat: 2
      long: 2
    ) {
      id
      address1
      address2
      city
      country
      lat
      long
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

  it('should have a mutation to create a new address', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: createAddressMut })
      .set('Accept', 'application/json')
      .then(response => {
        const result = get(response, 'body.data.createAddress');
        expect(result).toEqual(
          expect.objectContaining({
            id: 1,
            address1: 'new address one',
            address2: 'new address two',
            city: 'new city',
            country: 'new country'
          })
        );
        done();
      });
  });
});
