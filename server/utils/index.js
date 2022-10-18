import isEmpty from 'lodash/isEmpty';
import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';

const { combine, timestamp, printf } = format;
export const isTestEnv = () => process.env.ENVIRONMENT_NAME === 'test' || process.env.NODE_ENV === 'test';
export const isLocalEnv = () => process.env.ENVIRONMENT_NAME === 'local';

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
      type: new GraphQLNonNull(GraphQLInt)
    }
  }
};

export const stringifyWithCheck = message => {
  if (!message) {
    return '';
  }
  try {
    return JSON.stringify(message);
  } catch (err) {
    if (message.data) {
      return stringifyWithCheck(message.data);
    } else {
      console.log(message);
      return `unable to unfurl message: ${message}`;
    }
  }
};
export const logger = () => {
  const rTracerFormat = printf(info => {
    const rid = rTracer.id();
    // @ts-ignore
    const infoSplat = info[Symbol.for('splat')] || [];

    let message = `${info.timestamp}: ${stringifyWithCheck(info.message)} ${stringifyWithCheck(...infoSplat)}`;
    if (rid) {
      message = `[request-id:${rid}]: ${message}`;
    }
    return message;
  });
  return createLogger({
    format: combine(timestamp(), rTracerFormat),
    transports: [new transports.Console()]
  });
};

export const transformSQLError = e => (e.errors || []).map(err => err.message).join('. ') || e.original;

export const getLogger = () => {
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return args => logger().info(args);
};
