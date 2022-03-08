export const getSingleSupplierId = async (db, args) => {
  const res = await db.findOne({ where: { product_id: args.productId } });
  return res;
};
