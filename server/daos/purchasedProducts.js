import db from '@database/models';
import { transformSQLError } from '@utils/index';

export const insertPurchasedProducts = async args => db.purchasedProducts.create(args).catch(e => transformSQLError(e));
