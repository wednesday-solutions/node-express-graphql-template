module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      address_1: faker.address.streetName(),
      address_2: faker.address.streetAddress(),
      city: faker.address.city(),
      country: faker.address.country(),
      lat: faker.address.latitude(),
      long: faker.address.longitude()
    }));
    return queryInterface.bulkInsert('addresses', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('addresses', null, {})
};
