import { pubsub } from '@server/utils/pubsub';

export function getAsyncInterator(topicName) {
  return () => pubsub.asyncIterator(topicName);
}

export function getFilteredSubscription(payload, variables) {
  return payload.notifications.supplierId === variables.supplierId;
}
