import isEmpty from 'lodash/isEmpty';
import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';
import cloneDeep from 'lodash/cloneDeep';

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

export const getQueryFields = (fields, keyToCheck) => {
  const fieldsClone = cloneDeep(fields);
  Object.keys(fieldsClone).forEach(key => {
    if (fieldsClone[key][keyToCheck]) {
      fieldsClone[key].type = GraphQLNonNull(fieldsClone[key].type);
    }
  });
  return fieldsClone;
};

export const REQUIRED_ARGS = {
  isNonNull: true,
  isUpdateRequired: true,
  isCreateRequired: true
};

export const CREATE_AND_QUERY_REQUIRED_ARGS = {
  isNonNull: true,
  isCreateRequired: true
};
