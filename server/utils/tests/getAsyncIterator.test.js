import { SUBSCRIPTION_TOPICS } from '../constants';
import { getAsyncInterator } from '../iterator';
import { pubsub } from '../pubsub';

describe('getAsyncInterator tests', () => {
  it('should call the async iterator with the given topic', () => {
    const spy = jest.spyOn(pubsub, 'asyncIterator');
    getAsyncInterator(SUBSCRIPTION_TOPICS.NEW_PURCHASED_PRODUCT)();
    expect(spy).toBeCalled();
  });
});
