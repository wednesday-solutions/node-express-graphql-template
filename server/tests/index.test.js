import { testApp } from 'utils/testUtils/testApp';
var request = require('supertest');

describe('Server', () => {
  it('responds OK to GET /', done => {
    request(testApp)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('OK');
        done();
      });
  });

  const query = `
  query {
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }
  `;

  it('should respond to /graphql', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.__schema.queryType.fields[0].name).toBe('node');
        done();
      });
  });
});
