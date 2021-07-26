import { camelCase } from 'lodash';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import { getFileNames } from '@utils';
import { getClient } from '../index';

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

const sequelize = getClient();

export async function getModels(dir) {
  const db = {};
  const files = getFileNames(dir);
  const importFile = async name => {
    const modulePath = `./${name}`;
    const module = await import(`${modulePath}`);
    db[camelCase(name)] = module.model(sequelize, Sequelize.DataTypes);
  };
  await Promise.all((files || []).map(importFile));
  return db;
}

export async function initialize() {
  console.log({ getModels });
  const db = await getModels('./server/database/models');
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = sequelize;
  return db;
}
