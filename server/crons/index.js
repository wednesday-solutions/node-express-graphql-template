import cron from 'node-cron';
import { Worker, Queue, Scheduler } from 'node-resque';
import { registerSchedulerLoggers } from '@utils';
import { CRON_EXPRESSIONS, CRON_JOB_NAMES, TIME_ZONES } from '@utils/constants';
import { ioRedis } from '@utils/redis';

export const runScheduledJobs = async () => {
  const connectionDetails = {
    redis: ioRedis.redis
  };

  const dummyJob = async () => {
    console.log('Dummy job');
  };

  const jobs = {
    dummyJob: {
      perform: dummyJob
    }
  };

  const worker = new Worker({ connection: connectionDetails, queues: [CRON_JOB_NAMES.DUMMY_JOB] }, jobs);
  await worker.connect();
  worker.start();

  const queue = new Queue({ connection: connectionDetails }, jobs);
  const scheduler = new Scheduler({ connection: connectionDetails });
  await scheduler.connect();
  scheduler.start();

  registerSchedulerLoggers(worker, scheduler);

  // do this job every day at 12:00:00 AM, CRON style
  // we want to ensure that only one instance of this job is scheduled in our environment at once,
  // no matter how many schedulers we have running
  cron.schedule(
    CRON_EXPRESSIONS.EVERY_MINUTE,
    async () => {
      console.log('>>> Running scheduled function', scheduler.leader);
      if (scheduler.leader) {
        console.log('>>> enqueuing a job');
        await queue.connect();
        await queue.enqueue(CRON_JOB_NAMES.DUMMY_JOB, 'dummyJob');
      }
    },
    {
      scheduled: true /* Start the job right now */,
      timezone: TIME_ZONES.ASIA_SINGAPORE /* Time zone of this job. */
    }
  );
};
