const products = [
  {
    id: 1,
    name: 'test1',
    category: 'category1',
    amount: 10
  },
  {
    id: 2,
    name: 'test2',
    category: 'category2',
    amount: 20
  },
  {
    id: 3,
    name: 'test3',
    category: 'category3',
    amount: 30
  }
];

module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(4, 2000).map((value, index) => ({
      id: value,
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      amount: parseFloat(faker.commerce.price()) * 100
    }));
    const newArr = products.concat(arr);
    return queryInterface.bulkInsert('products', newArr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('products', null, {})
};
