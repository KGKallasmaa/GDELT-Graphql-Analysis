const everythingResolver = require('./queries/everything/query.jsx');

const rootResolver = {
  ...everythingResolver,
};

module.exports = rootResolver;
