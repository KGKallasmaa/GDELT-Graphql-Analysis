const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const app = express();

const graphQlSchema = require('./graphql/schema.jsx');
const graphQlResolvers = require('./graphql/root.jsx');

app.use(
  '/',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
    pretty: true,
  })
);
const port = 3000;
function connectToDatabase() {
  mongoose.connect('mongodb://localhost:27017/gdelt-database', {
    auth: { authSource: 'admin' },
    user: 'username',
    pass: 'password',
    useUnifiedTopology: true,
  });

  console.log('Successfully connected to the database.');
  const PORT = 3000;
  app.listen(PORT);
  console.log('GraphQL API server running at localhost:' + port);
}
connectToDatabase();
