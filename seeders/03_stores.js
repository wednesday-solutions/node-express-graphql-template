const storeList = [
  {
    name: 'testStore',
    address_id: 1
  }
];

module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(2, 2000).map((value, index) => ({
      name: faker.company.companyName(),
      address_id: 1 + parseInt(Math.random() * 1999)
    }));
    const newArr = storeList.concat(arr);
    return queryInterface.bulkInsert('stores', newArr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('stores', null, {})
};
