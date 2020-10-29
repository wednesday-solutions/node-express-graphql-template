import { db } from '@database/models';

export const findOneProduct = id => db.products.findOne({ where: id });

export const findProducts = (where = {}) => db.products.findAll({ where });
