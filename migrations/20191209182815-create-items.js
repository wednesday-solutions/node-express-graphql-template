const { migrate } = require('../server/utils/migrateUtils');

module.exports = {
  up: queryInterface => migrate(__filename, queryInterface),
  down: () => Promise.reject(new Error('error'))
};
