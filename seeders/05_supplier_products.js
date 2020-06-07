module.exports = {
  up: queryInterface => {
    const range = require('lodash/range');
    const arr = range(1, 2000).map((value, index) => ({
      supplier_id: 1 + parseInt(Math.random() * 1999),
      product_id: index + 1
    }));
    return queryInterface.bulkInsert('supplier_products', arr, {});
  },
  down: queryInterface => queryInterface.bulkDelete('supplier_products', null, {})
};
