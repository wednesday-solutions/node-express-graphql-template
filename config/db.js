const pg = require('pg');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

module.exports = {
  url:
    process.env.DB_URI ||
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${
      process.env.POSTGRES_DB
    }`,
  host: process.env.POSTGRES_HOST,
  dialectModule: pg,
  dialect: 'postgres',
  pool: {
    min: 0,
    max: 10,
    idle: 10000
  },
  define: {
    underscored: true,
    timestamps: false
  },
  retry: {
    match: [
      'unknown timed out',
      Sequelize.TimeoutError,
      'timed',
      'timeout',
      'TimeoutError',
      'Operation timeout',
      'refuse',
      'SQLITE_BUSY'
    ],
    max: 10 // maximum amount of tries
  }
};
