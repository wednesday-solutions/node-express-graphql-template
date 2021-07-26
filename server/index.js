import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import rTracer from 'cls-rtracer';
import { connect } from '@database';
import bodyParser from 'body-parser';
import { GraphQLSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { initialize } from '@database/models/index';
import { signUpRoute, signInRoute } from '@server/auth';
import { isTestEnv, logger, unless } from '@utils/index';
import authenticateToken from '@middleware/authenticate/index';

let db;
let app;

export const init = async () => {
  try {
    // configure environment variables
    dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

    // connect to database
    connect();
    db = await initialize();
    let schema = null;

    const getSchema = async () => {
      if (!db) {
        throw new Error('DB Models not initialised!');
      }
      const { createRootQuery } = await import('@gql/queries');
      const { createRootMutation } = await import('@gql/mutations');
      const query = await createRootQuery();
      const mutation = await createRootMutation();
      if (!schema) {
        return new GraphQLSchema({ query, mutation });
      }
      return schema;
    };

    // create the graphQL schema
    schema = await getSchema();

    if (!app) {
      app = express();
    }
    app.use(rTracer.expressMiddleware());

    app.use(
      '/graphql',
      graphqlHTTP({
        schema,
        graphiql: true,
        customFormatErrorFn: e => {
          logger().info({ e });
          return e;
        }
      })
    );

    app.use('/', (req, res) => {
      const message = 'Service up and running!';
      logger().info(message);
      res.json(message);
    });

    app.use(express.json());
    app.use(rTracer.expressMiddleware());
    app.use(unless(authenticateToken, '/sign-in', '/sign-up'));
    app.use(
      '/graphql',
      graphqlHTTP({
        schema: schema,
        graphiql: true,
        customFormatErrorFn: e => {
          logger().info({ e });
          return e;
        }
      })
    );

    const createBodyParsedRoutes = routeConfigs => {
      if (!routeConfigs.length) {
        return;
      }
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      const validate = configs => configs.every(({ path, handler, method }) => !!path && !!handler && !!method);
      try {
        if (validate(routeConfigs)) {
          routeConfigs.forEach(({ path, handler, method }) => app[method](path, multer().array(), handler));
        } else {
          throw new Error('Invalid route config');
        }
      } catch (error) {
        console.error(error);
      }
    };
    createBodyParsedRoutes([signUpRoute, signInRoute]);

    /* istanbul ignore next */
    if (!isTestEnv()) {
      app.listen(9000);
    }
    return app;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};

logger().info({ ENV: process.env.NODE_ENV });

if (!isTestEnv()) {
  init();
}

export const getDb = () => {
  if (db) {
    return db;
  }
  return {};
};

export const getApp = async () => {
  if (app) {
    return app;
  }
  return await init();
};

export { app, db };
