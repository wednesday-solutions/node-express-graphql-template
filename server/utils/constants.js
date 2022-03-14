export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';
export const MUTATION_TYPE = {
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update'
};

export const SUBSCRIPTION_TOPICS = {
  NOTIFICATIONS: 'notifications'
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
