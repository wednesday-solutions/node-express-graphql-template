import { SUBSCRIPTION_TOPICS } from '@server/utils/constants';
import { pubsub } from '@server/utils/pubsub';

export function iterator() {
  return pubsub.asyncIterator(SUBSCRIPTION_TOPICS.NOTIFICATIONS);
}

export function filter(payload, variables) {
  return payload.notifications.supplierId === variables.supplierId;
}
