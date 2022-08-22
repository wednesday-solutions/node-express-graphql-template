import { logger } from '@utils';

export const RESTRICTED = {
  query: {
    purchasedProducts: {
      // groups: [ "ADMIN", "SUPER_ADMIN", "USER"]
      isUnauthorized: async (decodedToken, args) => {
        logger().info(JSON.stringify({ decodedToken, args }));
        // sample logic to show custom restrictions
        // only user_id = 1 will be able to access this API
        return decodedToken?.user?.id !== 1;
      }
    }
  }
};
export const GQL_QUERY_TYPES = {
  query: {
    whitelist: ['purchasedProduct']
  },
  mutation: {
    whitelist: ['signUp', 'signIn']
  },
  subscription: { whitelist: [] }
};
