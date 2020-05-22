const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');

const QueryRoot = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        hello: {
            type: graphql.GraphQLString,
            resolve: () => 'Hello world!'
        }
    })
});

const schema = new graphql.GraphQLSchema({ query: QueryRoot });

const app = express();
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        graphiql: true
    })
);
app.listen(9000);
