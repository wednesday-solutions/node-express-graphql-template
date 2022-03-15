export function checkFilterCondition(payload, variables) {
  return payload.notifications.storeId === variables.storeId;
}
