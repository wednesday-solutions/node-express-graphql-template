module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');

    const arr = range(1, 20).map((value, index) => ({
      name: faker.commerce.productName(),
      genres: faker.commerce.department(),
      pages: parseFloat(faker.commerce.price()),
      published_by: faker.name.firstName()
    }));
    return queryInterface.bulkInsert('books', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('books', null, {})
};
