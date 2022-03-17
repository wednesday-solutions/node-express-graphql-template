import { aggregateCheck } from '@server/cronJobs/aggregateJob';
import Bull from 'bull';
import moment from 'moment';
const queues = {};

export const QUEUE_NAMES = {
  SCHEDULED_JOB: 'scheduledJob',
  AGGREGATE_CHECK: 'aggregateCheck'
};

export const QUEUE_PROCESSORS = {
  [QUEUE_NAMES.SCHEDULED_JOB]: (job, done) => {
    console.log(`${moment()}::Job with id: ${job.id} is being executed.\n`, {
      message: job.data.message
    });
    done();
  },
  [QUEUE_NAMES.AGGREGATE_CHECK]: (job, done) => {
    console.log('Aggregate job is getting executed');
    aggregateCheck();
    done();
  }
};

const CRON_EXPRESSIONS = {
  MIDNIGHT: '0 0 * * *'
};

export const initQueues = () => {
  console.log('init queues');
  Object.keys(QUEUE_PROCESSORS).forEach(queueName => {
    queues[queueName] = getQueue(queueName);
    queues[queueName].process(QUEUE_PROCESSORS[queueName]);
  });
  queues[QUEUE_NAMES.AGGREGATE_CHECK].add({}, { repeat: { cron: CRON_EXPRESSIONS.MIDNIGHT } });
};
export const getQueue = queueName => {
  if (!queues[queueName]) {
    queues[queueName] = new Bull(queueName, `redis://${process.env.REDIS_DOMAIN}:${process.env.REDIS_PORT}`);
    console.log('created queue: ', queueName, `redis://${process.env.REDIS_DOMAIN}:${process.env.REDIS_PORT}`);
  }
  return queues[queueName];
};
