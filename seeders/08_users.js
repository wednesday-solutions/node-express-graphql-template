module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const md5 = require('md5');

    const arr = range(1, 100).map((value, index) => {
      const createdBefore = parseInt(Math.random() * 1000);
      return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: md5('wednesdaySolution'),
        created_at: faker.date.recent(createdBefore)
      };
    });
    return queryInterface.bulkInsert('users', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
