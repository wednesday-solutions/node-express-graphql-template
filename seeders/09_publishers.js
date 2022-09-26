module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 20).map((value, index) => ({
      name: faker.commerce.productName(),
      country: faker.address.country()
    }));
    return queryInterface.bulkInsert('publishers', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('publishers', null, {})
};
