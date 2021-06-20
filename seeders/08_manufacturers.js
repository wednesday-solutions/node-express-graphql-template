module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 300).map((value, index) => ({
      name: faker.company.companyName(),
      origin_country: faker.address.country()
    }));
    return queryInterface.bulkInsert('manufacturers', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('manufacturers', null, {})
};
