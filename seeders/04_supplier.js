module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      name: faker.company.companyName(),
      address_id: 1 + parseInt(Math.random() * 1999)
    }));
    return queryInterface.bulkInsert('suppliers', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('suppliers', null, {})
};
