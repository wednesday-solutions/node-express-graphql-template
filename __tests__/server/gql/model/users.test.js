const { closeRedisConnection } = require('@server/services/redis');
const { getMockDBEnv, getResponse } = require('@server/utils/testUtils');
const { get } = require('lodash');

function getUsersQueryWithParams(limit, offset, fields = ['id', 'firstName', 'lastName', 'email']) {
  return `
  query Users {
    users(limit: ${limit}, offset: ${offset}) {
      edges {
        node {
          ${fields.map(item => item)},
          createdAt,
          updatedAt,
          deletedAt
        }
      }
    }
  }
  `;
}

function getUserWithIdOrQuery(id = null, query = null, fields = ['id', 'firstName', 'lastName', 'email']) {
  if (id && !query) {
    return `
    query Users {
      user(id: ${id}) {
        ${fields.map(item => item)},
        createdAt
        updatedAt
        deletedAt
      }
    }
    `;
  } else if (query && !id) {
    return `
    query Users {
      user(where: {
        firstName: "John"
      }) {
        ${fields.map(item => item)},
        createdAt
        updatedAt
        deletedAt
      }
    }
    `;
  } else {
    return `
    query Users {
      user(where: {
        firstName: "ABCDEF"
      }) {
        ${fields.map(item => item)},
        createdAt
        updatedAt
        deletedAt
      }
    }
    `;
  }
}

describe('Integration test for getUsers query', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.unmock('@database');
    jest.unmock('@database/models');
    jest.unmock('ioredis');
    process.env = { ...OLD_ENV };
    process.env = { ...process.env, ...getMockDBEnv(), REDIS_PORT: 6380 };
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    await closeRedisConnection(); // avoid jest open handle error
  });

  it('Should fetch users with given limit and offset', async () => {
    const limit = 10;
    const offset = 0;
    const response = await getResponse(getUsersQueryWithParams(limit, offset));

    const users = get(response, 'body.data.users.edges');
    // Perform assertions based on the response
    expect(users).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    expect(users.length).toBe(limit);

    const firstUser = users[0].node;
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('createdAt');
    expect(firstUser).toHaveProperty('updatedAt');
    expect(firstUser).toHaveProperty('deletedAt');
    expect(firstUser.firstName).toBe('John');
    expect(firstUser.lastName).toBe('Doe');
    expect(firstUser.email).toBe('john@example.com');
  });

  it('Should fetch users with given updated limit and offset', async () => {
    const limit = 5;
    const offset = 10;
    const response = await getResponse(getUsersQueryWithParams(limit, offset));

    const users = get(response, 'body.data.users.edges');
    // Perform assertions based on the response
    expect(users).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    expect(users.length).toBe(limit);

    const firstUser = users[0].node;
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('createdAt');
    expect(firstUser).toHaveProperty('updatedAt');
    expect(firstUser).toHaveProperty('deletedAt');
    expect(firstUser.id).toBe(`${offset + 1}`);
  });

  it('Should fetch users with only firstName and lastName field', async () => {
    const limit = 5;
    const offset = 10;
    const response = await getResponse(getUsersQueryWithParams(limit, offset, ['firstName', 'lastName']));

    const users = get(response, 'body.data.users.edges');
    // Perform assertions based on the response
    expect(users).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    expect(users.length).toBe(limit);

    const firstUser = users[0].node;
    expect(firstUser).not.toHaveProperty('id');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).not.toHaveProperty('email');
    expect(firstUser).toHaveProperty('createdAt');
    expect(firstUser).toHaveProperty('updatedAt');
    expect(firstUser).toHaveProperty('deletedAt');
  });

  it('Should fetch users with only firstName and lastName field', async () => {
    const limit = 5;
    const offset = 10;
    const response = await getResponse(getUsersQueryWithParams(limit, offset, ['firstName', 'lastName']));

    const users = get(response, 'body.data.users.edges');
    // Perform assertions based on the response
    expect(users).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    expect(users.length).toBe(limit);

    const firstUser = users[0].node;
    expect(firstUser).not.toHaveProperty('id');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).not.toHaveProperty('email');
    expect(firstUser).toHaveProperty('createdAt');
    expect(firstUser).toHaveProperty('updatedAt');
    expect(firstUser).toHaveProperty('deletedAt');
  });

  it('Should fetch user with given ID', async () => {
    const userId1 = 1;
    const userId2 = 2;
    const response1 = await getResponse(getUserWithIdOrQuery(userId1));
    const response2 = await getResponse(getUserWithIdOrQuery(userId2));

    const user1 = get(response1, 'body.data.user');
    const user2 = get(response2, 'body.data.user');
    // Perform assertions based on the response
    expect(user1).toBeTruthy();
    expect(user2).toBeTruthy();

    expect(user1).toHaveProperty('id');
    expect(user1).toHaveProperty('firstName');
    expect(user1).toHaveProperty('lastName');
    expect(user1).toHaveProperty('email');
    expect(user1).toHaveProperty('createdAt');
    expect(user1).toHaveProperty('updatedAt');
    expect(user1).toHaveProperty('deletedAt');
    expect(user1.id).toBe('1');
    expect(user1.firstName).toBe('John');
    expect(user1.lastName).toBe('Doe');
    expect(user1.email).toBe('john@example.com');

    expect(user2).toHaveProperty('id');
    expect(user2).toHaveProperty('firstName');
    expect(user2).toHaveProperty('lastName');
    expect(user2).toHaveProperty('email');
    expect(user2).toHaveProperty('createdAt');
    expect(user2).toHaveProperty('updatedAt');
    expect(user2).toHaveProperty('deletedAt');
    expect(user2.id).toBe('2');
  });

  it('Should fetch user with where query', async () => {
    const response = await getResponse(getUserWithIdOrQuery(false, true));

    const user = get(response, 'body.data.user');
    expect(user).toBeTruthy();

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
    expect(user).toHaveProperty('deletedAt');
    expect(user.id).toBe('1');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
  });

  it('Should fetch user with wrong query', async () => {
    const response = await getResponse(getUserWithIdOrQuery(false, false));

    const user = get(response, 'body.data.user');
    expect(user).not.toBeTruthy();

    expect(user).toBe(null);
  });
});
