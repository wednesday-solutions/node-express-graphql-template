import Sequelize from 'sequelize';
import * as pg from 'pg';
let client;

export const getClient = () => {
  if (!client) {
    try {
      client = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
        host: process.env.POSTGRES_HOST,
        dialectModule: pg,
        dialect: 'postgres'
      });
    } catch (err) {
      console.error({ err });
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
      db: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
export { client };
