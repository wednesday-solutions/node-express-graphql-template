import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLSchema } from 'graphql';
import 'whatwg-fetch';
import dotenv from 'dotenv';
import { createServer } from 'http';
import axios from 'axios';
import { newCircuitBreaker } from '@services/circuitbreaker';
import { corsOptionsDelegate, apolloServerContextResolver } from '@middleware/gqlAuth';
import rTracer from 'cls-rtracer';
import bodyParser from 'body-parser';
import { connect } from '@database';
import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { isLocalEnv, isTestEnv, logger } from '@utils/index';
import cluster from 'cluster';
import os from 'os';
import 'source-map-support/register';
import { initQueues } from '@utils/queue';
import { sendMessage } from '@services/slack';
import { SubscriptionRoot } from '@gql/subscriptions';
import depthLimit from 'graphql-depth-limit';
import logReqRes from './middleware/logger';

const totalCPUs = os.cpus().length;

let app;
export const fetchFromGithub = async query =>
  axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=2`);
const githubBreaker = newCircuitBreaker(fetchFromGithub, 'Github API is down');

export const init = async () => {
  // configure environment variables
  dotenv.config({
    path: `.env.${process.env.ENVIRONMENT_NAME}`
  });

  // connect to database
  connect();

  // create the graphQL schema
  const schema = new GraphQLSchema({
    query: QueryRoot,
    mutation: MutationRoot,
    subscription: SubscriptionRoot
  });

  if (!app) {
    app = express();
  }

  if (process.env.ENABLE_DEDUP) {
    const kMiddleware = require('@keploy/sdk/dist/v2/dedup/middleware.js');
    app.use(kMiddleware());
  }
  app.use(express.json());
  app.use(rTracer.expressMiddleware());
  app.use(cors(corsOptionsDelegate));
  app.use(logReqRes);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/github', async (req, res) => {
    const response = await githubBreaker.fire(req.query.repo);
    if (response.data) {
      return res.json({ data: response.data });
    } else {
      return res.status(424).json({ error: response });
    }
  });

  app.get('/', (req, res) => {
    const message = 'Service up and running!';
    sendMessage(message);
    logger().info(message);
    res.json({ data: message });
  });

  /* istanbul ignore next */
  if (!isTestEnv()) {
    const httpServer = createServer(app);
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql'
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
      schema,
      introspection: isLocalEnv(),
      validationRules: [depthLimit(6)],
      context: apolloServerContextResolver,
      formatError: e => {
        logger().info({ e });
        return e.message;
      },
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              }
            };
          }
        }
      ]
    });
    await server.start();

    const graphqlPath = '/graphql';
    app.use(graphqlPath, express.json(), expressMiddleware(server));

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
