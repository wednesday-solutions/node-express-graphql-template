// Replace the require statement with dynamic import
const { execSync } = require('child_process');
const { join } = require('path');
const { upAll, exec } = require('docker-compose');
const dotenv = require('dotenv');
const isPortReachable = require('is-port-reachable');

module.exports = async () => {
  console.time('global-setup');
  dotenv.config({ path: '.env.test' });

  // Use the imported module
  const isDBReachable = await isPortReachable(54320);

  if (isDBReachable) {
    console.log('DB already started');
  } else {
    console.log('\nStarting up dependencies please wait...\n');

    await upAll({
      cwd: join(__dirname),
      log: true
    });

    await exec('postgres', ['sh', '-c', 'until pg_isready ; do sleep 1; done'], {
      cwd: join(__dirname)
    });

    console.log('Running migrations...');
    execSync('npx sequelize db:migrate');

    console.log('Seeding the db...');
    execSync('npx sequelize db:seed:all');
  }

  console.timeEnd('global-setup');
};
