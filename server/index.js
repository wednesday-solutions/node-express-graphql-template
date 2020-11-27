import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv';

import { connect } from '@database';

import { QueryRoot } from '@gql/queries';
import { MutationRoot } from '@gql/mutations';
import { isTestEnv } from '@utils/index';

let app;
export const init = () => {
  // configure environment variables
  dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

  // connect to database
  connect();

  // create the graphQL schema
  const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

  if (isTestEnv() && !app) {
    app = express();
  }
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      graphiql: true,
      customFormatErrorFn: e => {
        if (process.env.ENVIRONMENT !== 'local') {
          return e.message;
        }
        console.log({ e });
        return e;
      }
    })
  );
  if (!isTestEnv()) {
    app.listen(9000);
  }
};

console.log({ ENV: process.env.NODE_ENV });

init();

export { app };
