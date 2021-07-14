import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv';
import multer from 'multer';
import rTracer from 'cls-rtracer';
import bodyParser from 'body-parser';
import { connect } from '@database';
import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { isTestEnv, logger } from '@utils/index';
import authRoutes from '@server/auth';
import authenticateToken from './middleware/authenticate/index';

let app;
export const init = () => {
  // configure environment variables
  dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

  // connect to database
  connect();

  // create the graphQL schema
  const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

  if (!app) {
    app = express();
  }
  app.use(express.json());
  app.use(rTracer.expressMiddleware());
  app.use(authenticateToken);
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
    if (!routeConfigs.length) return;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    routeConfigs.forEach(({ path, handler, method }) => app[method](path, multer().array(), handler));
  };
  createBodyParsedRoutes(authRoutes);

  app.use('/', (req, res) => {
    const message = 'Service up and running!';
    logger().info(message);
    res.json(message);
  });
  /* istanbul ignore next */
  if (!isTestEnv()) {
    app.listen(9000);
  }
};

logger().info({ ENV: process.env.NODE_ENV });

init();

export { app };
