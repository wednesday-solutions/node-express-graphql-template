const { updateManufacturerIdInProducts } = require('../server/utils/migrateUtils');

module.exports = {
  up: updateManufacturerIdInProducts,
  down: queryInterface => queryInterface.bulkDelete('products', null, {})
};
