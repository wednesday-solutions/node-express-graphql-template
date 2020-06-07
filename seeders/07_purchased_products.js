module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 10000).map((value, index) => {
      const price = parseFloat(faker.commerce.price()) * 100;
      const createdBefore = parseInt(Math.random() * 1000);
      return {
        price,
        product_id: 1 + parseInt(Math.random() * 1999),
        discount: parseInt(price / (Math.random() * 100)),
        delivery_date: faker.date.future(createdBefore + 3),
        created_at: faker.date.recent(createdBefore)
      };
    });
    return queryInterface.bulkInsert('purchased_products', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('purchased_products', null, {})
};
