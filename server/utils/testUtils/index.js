import { testApp } from './testApp';

export async function testServer() {
  testApp.listen(9001);
}

export function mockDBClient() {
  var SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  var DBConnectionMock = new SequelizeMock();
  return DBConnectionMock;
}

export async function connectToMockDB() {
  const client = mockDBClient();
  try {
    client.authenticate();
  } catch (error) {
    console.error(error);
  }
}
