const { closeRedisConnection } = require('@server/services/redis');
const { down } = require('docker-compose');
const { join } = require('path');

module.exports = async () => {
  // Close the Redis connection
  await closeRedisConnection();
  await down({
    commandOptions: ['--remove-orphans'],
    cwd: join(__dirname)
  });
};
