import { readdirSync } from 'fs';
import rTracer from 'cls-rtracer';
import { singular } from 'pluralize';
import isEmpty from 'lodash/isEmpty';
import camelCase from 'lodash/camelCase';
import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { createLogger, format, transports } from 'winston';

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

export const getFileNames = (dir, exclude = []) => {
  const excludes = ['tests', 'index'].concat(exclude);
  const nameFilter = dir => {
    const { name: dirName } = dir;
    const withoutFileExtension = !dir.isDirectory() ? dirName.split('.js')[0] : dirName;
    return !excludes.includes(withoutFileExtension);
  };
  try {
    const files = readdirSync(dir, { withFileTypes: true })
      .filter(nameFilter)
      .map(({ name: dirName }) => dirName.split('.')[0]);
    return files;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const createModelGetter = ({ tables, append }) => {
  if (!['Queries', 'Mutations'].includes(append)) {
    throw new Error('Invalid getter post Append');
  }
  const invokeGetter = (fileName, model) => {
    const tableName = camelCase(singular(fileName));
    const getter = `${tableName}${append}`;
    if (model[getter]) {
      tables[tableName] = model[getter];
    } else {
      throw new Error(`getter not found for ${fileName}`);
    }
  };
  if (!tables) {
    throw new Error('Missing params');
  }
  return invokeGetter;
};
