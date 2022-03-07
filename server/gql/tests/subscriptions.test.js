import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { pubsub } from '@utils/pubsub';

describe('Subscriptions test', () => {
  let dbClient;
  beforeEach(() => {
    dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
  });

  it('should create a subscription', async () => {
    const res = await getResponse(`subscription Notifications {
        notifications {
          message
          scheduleIn
        }
      }   `);
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject({
      data: {
        notifications: null
      }
    });
    pubsub.close();
  });
});
