import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { getClient } from '../index';

export const db = {};

dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

const sequelize = getClient();

db.products = require('@database/models/products').model(sequelize, Sequelize.DataTypes);
db.stores = require('@database/models/stores').model(sequelize, Sequelize.DataTypes);
db.addresses = require('@database/models/addresses').model(sequelize, Sequelize.DataTypes);
db.suppliers = require('@database/models/suppliers').model(sequelize, Sequelize.DataTypes);
db.users = require('@database/models/users').model(sequelize, Sequelize.DataTypes);

db.purchasedProducts = require('@database/models/purchased_products').model(sequelize, Sequelize.DataTypes);
db.storeProducts = require('@database/models/store_products').model(sequelize, Sequelize.DataTypes);
db.supplierProducts = require('@database/models/supplier_products').model(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

export default db;
