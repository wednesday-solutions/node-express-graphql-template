import express from 'express';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv';
import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { client } from '@database';
import { SubscriptionRoot } from '@gql/subscriptions';
import { ApolloServer } from 'apollo-server-express';
import { logger } from '..';

const connect = async () => {
  await client.authenticate();
};

connect();

// configure environment variables
dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

// create the graphQL schema
const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot, subscription: SubscriptionRoot });

const getTestApp = async () => {
  const testApp = express();
  const server = new ApolloServer({
    schema,
    formatError: e => {
      logger().info({ e });
      return e.message;
    }
  });
  await server.start();

  server.applyMiddleware({ app: testApp });
  testApp.use('/', (_, response) => {
    response
      .status(200)
      .json({ message: 'OK' })
      .send();
  });
  return testApp;
};

export { getTestApp };
