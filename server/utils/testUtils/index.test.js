import { app } from 'server';

var request = require('supertest');

describe('loading express', function() {
  it('responds to /', done => {
    request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
