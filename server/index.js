import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv';

import { connect } from 'database';

import { QueryRoot } from 'gql/queries';
import { MutationRoot } from 'gql/mutations';

// configure environment variables
dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

// connect to database
connect();

// create the graphQL schema
const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

const app = express();
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
app.listen(9000);

export { app };
