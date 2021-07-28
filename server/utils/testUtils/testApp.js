import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv';

import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { client } from '@database';

const connect = async () => {
  await client.authenticate();
};

connect();

// configure environment variables
dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

// create the graphQL schema
const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

const testApp = express();
testApp.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: false,
    customFormatErrorFn: e => {
      if (process.env.ENVIRONMENT_NAME !== 'local') {
        return e.message;
      }
      return e;
    }
  }),
  (request, response, next) => {
    next();
  }
);

testApp.use('/', (_, response) => {
  response
    .status(200)
    .json({ message: 'OK' })
    .send();
});

export { testApp };
