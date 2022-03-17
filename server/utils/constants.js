export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';
export const MUTATION_TYPE = {
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update'
};

export const SUBSCRIPTION_TOPICS = {
  NEW_PURCHASED_PRODUCT: 'newPurchasedProduct'
};

export const WHITELISTED_PATHS = {
  '/': {
    methods: ['GET']
  },
  '/sign-in': {
    methods: ['POST']
  },
  '/sign-up': {
    methods: ['POST']
  }
};

export const REDIS_IMPLEMENTATION_DATE = '2022-03-16';
