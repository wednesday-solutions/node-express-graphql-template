import gql from 'graphql-tag';
import { flatMap } from 'lodash';
import { isLocalEnv, isTestEnv, logger } from '@utils';
import { convertToMap } from '@utils/gqlSchemaParsers';
import { GQL_QUERY_TYPES } from './constants';
import { connect } from '@database';
import { sendMessage } from '@services/slack';

const { parse } = require('graphql');

export const invalidScope = (
  res,
  errors = [`Invalid scope to perform this operation. Contact support@wednesday.is for more information.`]
) =>
  res.status(401).send({
    errors
  });

export const getQueryNames = req => {
  const getQueryNamesFromSelectionSet = def =>
    def.selectionSet.selections.map(selection => ({
      operationType: def.operation,
      queryName: selection.name.value
    }));
  const operationName = req.body.operationName;
  const parsedQuery = parse(req.body.query);
  // find the correct defination based on the operation name
  const def = parsedQuery.definitions.find(definition => definition.name?.value === operationName);
  let queries = [];
  // def will only have a value if operationName is specifically provided. It is optional
  if (def) {
    queries = getQueryNamesFromSelectionSet(def);
  } else {
    // iterate over all definitions. Since multiple operations cannot be sent without an operation name
    // most likely parsedQuery.definitions will have length as 1.
    queries = flatMap(parsedQuery.definitions, getQueryNamesFromSelectionSet);
  }
  return queries.filter(({ operationType, queryName }) => !!operationType && !!queryName);
};

export const isPublicQuery = async req => {
  const queries = getQueryNames(req);
  return queries.every(({ queryName, operationType }) => GQL_QUERY_TYPES[operationType].whitelist.includes(queryName));
};

export const isAuthenticated = async (req, res, next) => {
  try {
    // For accessing graphql without authentication when debugging.
    if (req.method.toLowerCase() === 'get') {
      next();
      return;
    }
    if (isTestEnv() || (await isPublicQuery(req))) {
      next();
    } else {
      let args;
      const graphQLBody = gql`
        ${req.body.query}
      `;
      if (graphQLBody.definitions?.length && graphQLBody.definitions[0].selectionSet?.selections?.length) {
        args = convertToMap(graphQLBody.definitions[0].selectionSet.selections[0].arguments, req.body.variables);
        req.parentArgs = args;
      }

      next();
    }
  } catch (err) {
    logger().info('Error in the gqlAuth middleware', err);
    connect(true);
    sendMessage(JSON.stringify(err.message));
    return res.status(500).send({
      errors: [err.message || 'Internal server error']
    });
  }
};

export const handlePreflightRequest = function(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.sendStatus(200);
  } else {
    next();
  }
};

export const corsOptionsDelegate = function(req, callback) {
  const allowedDomain = 'wednesday.is';
  let corsOptions;

  if (isLocalEnv() || isTestEnv()) {
    corsOptions = { origin: true };
  } else if (req?.header('Origin')?.includes(allowedDomain) || req?.header('Origin')?.includes('localhost')) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }

  callback(null, corsOptions); // callback expects two parameters: error and options
};
