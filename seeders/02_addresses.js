const addressList = [
  {
    address_1: 'Pacocha Corner',
    address_2: '5165 Molly Isle',
    city: 'East Annefort',
    country: 'Monaco',
    latitude: -52.7322,
    longitude: -10.0744
  }
];

module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(2, 2000).map((value, index) => ({
      address_1: faker.address.streetName(),
      address_2: faker.address.streetAddress(),
      city: faker.address.city(),
      country: faker.address.country(),
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude()
    }));
    const newArr = addressList.concat(arr);
    return queryInterface.bulkInsert('addresses', newArr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('addresses', null, {})
};
