const simpleResolver = require('./queries/simple_query.jsx');
const mediumResolver = require('./queries/medium_query.jsx');
const advancedResolver = require('./queries/advanced_query.jsx');

const rootResolver = {
  ...simpleResolver,
  ...mediumResolver,
  ...advancedResolver,
};
module.exports = rootResolver;
