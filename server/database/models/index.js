import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getClient } from '../index';

const basename = path.basename(__filename);

const db = {};

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const sequelize = getClient();
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

module.exports = db;
