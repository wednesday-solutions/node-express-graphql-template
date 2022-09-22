export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';
export const MUTATION_TYPE = {
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update'
};

export const QUERY_TYPE = {
  CUSTOM: 'custom'
};

export const SUBSCRIPTION_TOPICS = {
  NEW_PURCHASED_PRODUCT: 'newPurchasedProduct'
};

// This date indicates when the mutations on createPurchasedProduct went live. We will not have to recalculate aggregate from database after this date.
export const REDIS_IMPLEMENTATION_DATE = '2022-03-16';
