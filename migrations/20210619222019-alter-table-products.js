const { migrate, updateManufacturerIdInProducts } = require('../server/utils/migrateUtils');

module.exports = {
  up: queryInterface => {
    migrate(__filename, queryInterface);
    return updateManufacturerIdInProducts(queryInterface);
  },
  down: () => Promise.reject(new Error('error'))
};
