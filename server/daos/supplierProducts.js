import db from '@database/models';
const model = db.supplierProducts;
export const getSingleSupplierId = async args => {
  const res = await model.findOne({ where: { product_id: args.productId } });
  return res;
};
