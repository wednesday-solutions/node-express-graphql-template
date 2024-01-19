const faker = require('faker');
const md5 = require('md5');

const createdBefore = parseInt(Math.random() * 1000);

const users = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'password',
    created_at: faker.date.recent(createdBefore)
  },
  {
    id: 2,
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    password: 'password',
    created_at: faker.date.recent(createdBefore)
  }
];

module.exports = {
  up: queryInterface => {
    const range = require('lodash/range');

    const arr = range(3, 100).map((value, index) => {
      const createdBefore = parseInt(Math.random() * 1000);
      return {
        id: value,
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: md5('wednesdaySolutions'),
        created_at: faker.date.recent(createdBefore)
      };
    });
    const newArr = users.concat(arr);
    return queryInterface.bulkInsert('users', newArr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
