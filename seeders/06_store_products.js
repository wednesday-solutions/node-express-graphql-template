module.exports = {
  up: queryInterface => {
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      store_id: 1 + parseInt(Math.random() * 1999),
      product_id: 1 + index
    }));
    return queryInterface.bulkInsert('store_products', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('store_products', null, {})
};
