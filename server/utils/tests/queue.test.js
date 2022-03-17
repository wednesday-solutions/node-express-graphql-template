import { getQueue, initQueues, QUEUE_PROCESSORS } from '@utils/queue';
import moment from 'moment';
import * as queue from '@utils/queue';

describe('Queue tests', () => {
  it('getQueues should create a queue if not present', async () => {
    const sampleQueue = 'sampleQueue';
    const res = await getQueue(sampleQueue);
    expect(res.data).toEqual(sampleQueue);
  });
  it('should return the queue if already present ', async () => {
    jest.spyOn(queue, 'getQueue').mockImplementation(name => {
      const queueName = name;
      const queues = {};
      queues[queueName] = {
        data: 'This is sample queue',
        process: jest.fn()
      };
      return queues[name];
    });
    const res = await getQueue('sampleQueue');
    expect(res.data).toBe('This is sample queue');
    jest.spyOn(queue, 'getQueue').mockClear();
  });
  it('should initialize the queues', async () => {
    jest.spyOn(QUEUE_PROCESSORS, 'scheduledJob').mockImplementation(() => ({
      sampleQueue: job => ({
        message: job.message
      })
    }));
    jest.spyOn(console, 'log');
    await initQueues();
    expect(console.log.mock.calls[0][0]).toBe('init queues');
    jest.spyOn(console, 'log').mockClear();
  });

  describe('Queue processes tests', () => {
    beforeAll(() => {
      jest.restoreAllMocks();
    });
    it('should console the job id if a job is getting executed', () => {
      jest.resetModules();
      jest.spyOn(console, 'log');
      initQueues();
      expect(console.log.mock.calls.length).toBe(5);
      expect(console.log.mock.calls[1][0]).toBe(`${moment()}::Job with id: 1 is being executed.\n`);
      expect(console.log.mock.calls[2][0]).toBe('done');
    });
  });
});
