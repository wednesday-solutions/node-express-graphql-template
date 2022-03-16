export function checkFilterCondition(payload, variables) {
  return Number(payload.newPurchasedProduct.storeId) === variables.storeId;
}
