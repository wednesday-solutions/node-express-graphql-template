module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      name: faker.internet.userName()
    }));
    return queryInterface.bulkInsert('students', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('students', null, {})
};
