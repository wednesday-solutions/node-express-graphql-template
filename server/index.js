import express from 'express';
import cors from 'cors';
import { SubscriptionServer } from 'subscriptions-transport-ws/dist/server';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema, execute, subscribe } from 'graphql';
import 'whatwg-fetch';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import multer from 'multer';
import axios from 'axios';
import get from 'lodash/get';
import { newCircuitBreaker } from '@services/circuitbreaker';
import { isAuthenticated, handlePreflightRequest, corsOptionsDelegate } from '@middleware/gqlAuth';
import rTracer from 'cls-rtracer';
import bodyParser from 'body-parser';
import { connect } from '@database';
import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { isLocalEnv, isTestEnv, logger } from '@utils/index';
import { signUpRoute, signInRoute } from '@server/auth';
import cluster from 'cluster';
import os from 'os';
import authenticateToken from '@middleware/authenticate';
import 'source-map-support/register';
import { initQueues } from '@utils/queue';
import { sendMessage } from '@services/slack';
import { SubscriptionRoot } from '@gql/subscriptions';
import { WHITELISTED_PATHS } from '@utils/constants';

const totalCPUs = os.cpus().length;

let app;
export const fetchFromGithub = async query =>
  axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=2`);
const githubBreaker = newCircuitBreaker(fetchFromGithub, 'Github API is down');
export const init = async () => {
  // configure environment variables
  dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

  // connect to database
  connect();

  // create the graphQL schema
  const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot, subscription: SubscriptionRoot });

  if (!app) {
    app = express();
  }

  app.use(express.json());
  app.use(rTracer.expressMiddleware());
  app.use(cors(corsOptionsDelegate));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(
    '/graphql',
    handlePreflightRequest, // handle pre-flight request for graphql endpoint
    isAuthenticated,
    graphqlHTTP({
      schema: schema,
      graphiql: true,
      customFormatErrorFn: e => e
    })
  );

  const addAuthMiddleware = (path, method) => {
    if (get(WHITELISTED_PATHS, `[${path}].methods`, []).includes(method.toUpperCase())) {
      return;
    }
    return authenticateToken;
  };
  const createBodyParsedRoutes = routeConfigs => {
    if (!routeConfigs.length) {
      return;
    }

    const validate = configs => configs.every(({ path, handler, method }) => !!path && !!handler && !!method);
    const createRouteArgs = (path, handler, method) =>
      [path, multer().array(), addAuthMiddleware(path, method), handler].filter(a => a);
    try {
      if (validate(routeConfigs)) {
        routeConfigs.forEach(({ path, handler, method }) => app[method](...createRouteArgs(path, handler, method)));
      } else {
        throw new Error('Invalid route config');
      }
    } catch (error) {
      console.error(error);
    }
  };
  createBodyParsedRoutes([
    signUpRoute,
    signInRoute,
    {
      path: '/github',
      method: 'get',
      handler: async (req, res) => {
        const response = await githubBreaker.fire(req.query.repo);
        if (response.data) {
          return res.json({ data: response.data });
        } else {
          return res.status(424).json({ error: response });
        }
      }
    }
  ]);

  app.use('/', (req, res) => {
    const message = 'Service up and running!';
    sendMessage(message);
    logger().info(message);
    res.json(message);
  });

  /* istanbul ignore next */
  if (!isTestEnv()) {
    const httpServer = createServer(app);
    const server = new ApolloServer({
      schema
    });
    await server.start();
    server.applyMiddleware({ app });
    const subscriptionServer = SubscriptionServer.create(
      { schema, execute, subscribe },
      { server: httpServer, path: server.graphqlPath }
    );
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => subscriptionServer.close());
    });
    httpServer.listen(9000, () => {
      console.log(`Server is now running on http://localhost:9000/graphql`);
    });
    initQueues();
  }
};

logger().info({ ENV: process.env.NODE_ENV });

if (!isTestEnv() && !isLocalEnv() && cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  init();
}

export { app };
