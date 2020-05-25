import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import dotenv from 'dotenv';
import { Aggregate } from 'models/aggregate';
import { connect } from 'database';
import { nodeField } from './node';
import { addQueries } from './schema';

// configure environment variables
dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });

// connect to database
connect();

const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    ...addQueries(),
    aggregate: Aggregate
  })
});

const schema = new GraphQLSchema({ query: QueryRoot });

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);
app.listen(9000);

export { app };
