module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 20).map((value, index) => ({
      language: faker.address.country()
    }));
    return queryInterface.bulkInsert('languages', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('languages', null, {})
};
