module.exports = {
  up: queryInterface => {
    const faker = require('faker');
    const range = require('lodash/range');
    const arr = range(1, 800000).map((value, index) => {
      const price = parseFloat(faker.commerce.price()) * 100;
      const createdBefore = parseInt(Math.random() * 1000);
      return {
        price,
        item_id: 1 + parseInt(Math.random() * 399999),
        discount: parseInt(price / (Math.random() * 100)),
        delivery_date: faker.date.future(createdBefore + 3),
        created_at: faker.date.recent(createdBefore)
      };
    });
    return queryInterface.bulkInsert('purchased_items', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('purchased_items', null, {})
};
