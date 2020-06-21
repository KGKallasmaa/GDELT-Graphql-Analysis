let { GraphQLSchema } = require('graphql');

const root = require('./root.jsx');

const GdeltAppSchema = new GraphQLSchema({
  query: root,
});

module.exports = GdeltAppSchema;
