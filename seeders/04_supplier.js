const supplierList = [
  {
    name: 'testSupplier',
    address_id: 1
  }
];

module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      name: faker.company.companyName(),
      address_id: 1 + parseInt(Math.random() * 1999)
    }));
    const newArr = supplierList.concat(arr);
    return queryInterface.bulkInsert('suppliers', newArr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('suppliers', null, {})
};
