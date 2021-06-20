const fs = require('fs');
const shell = require('shelljs');

function getVersion(currentFileName) {
  let version;
  shell.ls(`./migrations`).forEach((item, index) => {
    if (item === currentFileName) {
      version = index + 1;
    }
  });
  return version;
}

function updateManufacturerIdInProducts(queryInterface) {
  const range = require('lodash/range');
  return Promise.all(
    range(1, 2000).map(async (value, index) => {
      const manufacturerId = 1 + parseInt(Math.random() * 299);
      return queryInterface.bulkUpdate('products', { manufacturer_id: manufacturerId }, { id: index + 1 });
    })
  );
}

module.exports = {
  migrate: async function(currentFileName, queryInterface) {
    const version = getVersion(currentFileName.split('/')[currentFileName.split('/').length - 1]);
    const directories = shell.ls(`./resources/v${version}`);
    for (let index = 0; index < directories.length; index++) {
      const fileName = directories[index];
      await queryInterface.sequelize.query(fs.readFileSync(`./resources/v${version}/${fileName}`, 'utf-8')).catch(e => {
        const error = e.original.sqlMessage;
        console.log(error);
        if (error && error.startsWith('Table') && error.endsWith('already exists')) {
          // If the database is already built add this migration to sequelizeMeta table.
          return;
        }
        throw e;
      });
    }
  },
  getVersion,
  updateManufacturerIdInProducts
};
