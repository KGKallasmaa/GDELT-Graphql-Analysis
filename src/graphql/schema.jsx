const MasterType = require('./entity/Master.jsx');

const _ = require('lodash');
const path = require("path");
let { GraphQLList, GraphQLObjectType, GraphQLSchema } = require('graphql');

const fs = require('fs');

function getALLData(filename, label) {
  let absolutePath = path.resolve(filename);
  let rawdata = fs.readFileSync(absolutePath);
  let parsed = JSON.parse(rawdata)['data'];

  let return_data = [];

  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]['labels'][0] === label) {
      const properties = parsed[i]['properties'];
      return_data.push(properties);
    }
  }
  return return_data;
}

const rawData = getALLData('./src/graphql/data/master.json', 'Master');



const BlogQueryRootType = new GraphQLObjectType({
  name: 'GdeltAppSchema',
  description: 'GDELT Application Schema Query Root',
  fields: () => ({
    everything: {
      type: new GraphQLList(MasterType),
      description: 'This allows you do get an answer from every ROW',
      resolve: function () {
        return rawData;
      },
    }
  }),
});

const GdeltAppSchema = new GraphQLSchema({
  query: BlogQueryRootType,
});

module.exports = GdeltAppSchema;
