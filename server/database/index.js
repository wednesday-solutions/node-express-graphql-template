import Sequelize from 'sequelize';
import { getLogger, isTestEnv, logger } from '@server/utils';
import dbConfig from '@config/db';

let client;
let namespace;
const cls = require('cls-hooked');

export const getClient = force => {
  if (!namespace) {
    namespace = cls.createNamespace(`${process.env.ENVIRONMENT_NAME}-namespace`);
  }
  if (force || !client) {
    try {
      if (!isTestEnv()) {
        Sequelize.useCLS(namespace);
      }
      client = new Sequelize(dbConfig.url, {
        logging: isTestEnv() ? false : getLogger(),
        ...dbConfig
      });
    } catch (err) {
      logger().info({ err });
      throw err;
    }
  }
  return client;
};
export const connect = async () => {
  client = getClient();
  try {
    await client.authenticate();
    console.log('Connection has been established successfully.\n', {
      db_uri: dbConfig.url
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
export { client };
