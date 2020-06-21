const MasterType = require('./entity/Master.jsx');
const path = require('path');
let { GraphQLList, GraphQLObjectType, GraphQLFloat } = require('graphql');

const fs = require('fs');
var cwd = __dirname;

function getALLData(filename, label) {
  let absolutePath = path.resolve(cwd + '/data/' + filename); // TODO: I don't know why extra /data/ was added
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

function getActionsNear(filename, label, lat, long) {
  let absolutePath = path.resolve(filename);
  let rawdata = fs.readFileSync(absolutePath);
  let parsed = JSON.parse(rawdata)['data'];

  let return_data = [];
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]['labels'][0] === label) {
      const properties = parsed[i]['properties'];

      if (Math.abs(properties['Actor1Geo_Lat'] - lat) <= 100 && Math.abs(properties['Actor1Geo_Long'] - long)) {
        return_data.push(properties);
      }
    }
  }
  return return_data;
}

const Root = new GraphQLObjectType({
  name: 'Query',
  description: 'GDELT Application Schema Query Root',
  fields: () => ({
    everything: {
      type: new GraphQLList(MasterType),
      description: 'This allows you do get an answer from every ROW',
      resolve: function () {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getALLData(file_name, 'Master'));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },
    actions_near: {
      args: {
        lat: {
          type: GraphQLFloat,
        },
        long: {
          type: GraphQLFloat,
        },
      },
      type: new GraphQLList(MasterType),
      description: 'Finds actions that happened near(in 100km radius) the given coordinates',
      resolve: (MasterType, args) => {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getActionsNear('./src/graphql/data/master.json', 'Master', args.lat, args.long));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },
    unique_actors: {
      distinct_on: ['Actor1Name'],
      sort: {
        field: 'Actor1Name',
        order: 'ASC',
      },
      type: new GraphQLList(MasterType),
      description: 'Finds all of the news soruces',
      resolve: function () {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getALLData(file_name, 'Master'));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },
  }),
});
module.exports = Root;
