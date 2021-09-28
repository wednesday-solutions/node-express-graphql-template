import isEmpty from 'lodash/isEmpty';
import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';

const { combine, timestamp, printf } = format;
export const isTestEnv = () => process.env.ENVIRONMENT_NAME === 'test';

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
    return rid
      ? `${info.timestamp} [request-id:${rid}]: ${JSON.stringify(info.message)}`
      : `${info.timestamp}: ${JSON.stringify(info.message)}`;
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
