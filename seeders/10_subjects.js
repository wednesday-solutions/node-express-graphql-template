module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      name: faker.name.jobArea()
    }));
    return queryInterface.bulkInsert('subjects', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('subjects', null, {})
};
