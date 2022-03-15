import { pubsub } from '@utils/pubsub';
export function getAsyncInterator(topicName) {
  return () => pubsub.asyncIterator(topicName);
}
