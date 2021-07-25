import isEmpty from 'lodash/isEmpty';
import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';

const { combine, timestamp, printf } = format;
export const isTestEnv = () => process.env.ENVIRONMENT === 'test';

export const addWhereClause = (where, clause) => {
  if (isEmpty(where)) {
    where += ' WHERE (';
  } else {
    where += ' AND (';
  }
  return ` ${where} ${clause} ) `;
};

export const totalConnectionFields = {
  connectionFields: {
    total: {
      resolve: meta => meta.fullCount,
      type: GraphQLNonNull(GraphQLInt)
    }
  }
};

export const logger = () => {
  const rTracerFormat = printf(info => {
    const rid = rTracer.id();
    return rid ? `${info.timestamp} [request-id:${rid}]: ${info.message}` : `${info.timestamp}: ${info.message}`;
  });
  return createLogger({
    format: combine(timestamp(), rTracerFormat),
    transports: [new transports.Console()]
  });
};

export const unless = function(middleware, ...paths) {
  return function(req, res, next) {
    const pathCheck = paths.some(path => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};

export const registerSchedulerLoggers = (worker, scheduler) => {
  // //////////////////////
  // REGISTER FOR EVENTS //
  // //////////////////////
  worker.on('success', (queue, job, result, duration) => {
    console.log(`job success ${queue} ${JSON.stringify(job)} >> ${result} (${duration}ms)`);
  });
  worker.on('failure', (queue, job, failure, duration) => {
    console.log(`job failure ${queue} ${JSON.stringify(job)} >> ${failure} (${duration}ms)`);
  });
  worker.on('error', (error, queue, job) => {
    console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`);
  });

  scheduler.on('error', error => {
    console.log(`scheduler error >> ${error}`);
  });
};
