import gql from 'graphql-tag';
import { isLocalEnv, isTestEnv, logger } from '@utils';
import { convertToMap } from '@utils/gqlSchemaParsers';
import jwt from 'jsonwebtoken';
import { NO_AUTH_QUERIES, RESTRICTED, GQL_QUERY_TYPES } from './constants';

import { connect } from '@database';
import { sendMessage } from '@services/slack';
import get from 'lodash/get';

const { parse } = require('graphql');
const firstOperationDefinition = ast => ast.definitions[0];
const firstFieldValueNameFromOperation = operationDefinition =>
  operationDefinition.selectionSet.selections[0].name.value;

export const invalidScope = (
  res,
  errors = [`Invalid scope to perform this operation. Contact support@wednesday.is for more information.`]
) =>
  res.status(401).send({
    errors
  });

export const getQueryName = async req => {
  const parsedQuery = parse(req.body.query);
  const operationType = firstOperationDefinition(parsedQuery).operation;
  const queryName = firstFieldValueNameFromOperation(firstOperationDefinition(parsedQuery));

  return { operationType, queryName };
};

export const isPublicQuery = async req => {
  const { queryName, operationType } = await getQueryName(req);
  const isQuery = operationType === GQL_QUERY_TYPES.QUERY;
  const isNoAuthQuery = NO_AUTH_QUERIES.includes(queryName);
  return isQuery && isNoAuthQuery;
};

export const isAuthenticated = async (req, res, next) => {
  try {
    // For accessing graphql without authentication when debugging.
    if (isLocalEnv() || isTestEnv() || (await isPublicQuery(req))) {
      next();
    } else {
      const accessTokenFromClient = req.headers.authorization;
      let args;
      if (!accessTokenFromClient) {
        logger().info('missing access token');
        return invalidScope(res, 'Access Token missing from header');
      } else {
        const token = get(accessTokenFromClient?.split(' '), '[1]');
        return new Promise((resolve, reject) => {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (!err) {
              return resolve(user);
            }
            reject(err);
          });
        })
          .then(async response => {
            const graphQLBody = gql`
              ${req.body.query}
            `;
            let isUnauthorized = false;
            if (graphQLBody.definitions?.length && graphQLBody.definitions[0].selectionSet?.selections?.length) {
              args = convertToMap(graphQLBody.definitions[0].selectionSet.selections[0].arguments, req.body.variables);
              const name = graphQLBody.definitions[0].selectionSet.selections[0].name.value;
              const operation = graphQLBody.definitions[0].operation;
              if (get(RESTRICTED, `[${operation}][${name}]`)) {
                const item = get(RESTRICTED, `[${operation}][${name}]`);
                logger().info({ operation, name });
                isUnauthorized = item.isUnauthorized ? await item.isUnauthorized(response, args) : false;
              }
            }
            if (isUnauthorized) {
              return invalidScope(res);
            }

            logger().info(JSON.stringify(response));
            next();
          })
          .catch(err => {
            logger().info(err);
            logger().info('caught');
            return invalidScope(res, [err.message || 'Internal server error']);
          });
      }
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

// Custom logic for allowing backend api to be accessed by specific origin, pawlyclinic domain only for now!
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
