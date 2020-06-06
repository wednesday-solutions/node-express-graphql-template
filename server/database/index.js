import Sequelize from 'sequelize';

let client;
export const getClient = () => {
  if (!client) {
    client = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres'
    });
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
  }
};
export { client };
