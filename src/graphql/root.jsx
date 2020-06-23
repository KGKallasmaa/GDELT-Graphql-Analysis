const MasterType = require('./entity/Master.jsx');
const path = require('path');
let { GraphQLList, GraphQLObjectType, GraphQLFloat, GraphQLInt, GraphQLString } = require('graphql');

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
  let absolutePath = path.resolve(cwd + '/data/' + filename);
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

function getActionsMonth(filename, label, month) {
  let absolutePath = path.resolve(cwd + '/data/' + filename);
  let rawdata = fs.readFileSync(absolutePath);
  let parsed = JSON.parse(rawdata)['data'];

  let return_data = [];
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]['labels'][0] === label) {
      const properties = parsed[i]['properties'];

      if (properties['MonthYear'] == month) {
        return_data.push(properties);
      }
    }
  }
  return return_data;
}

function getActorAndEvent(filename, label, actor, action) {
  let absolutePath = path.resolve(cwd + '/data/' + filename);
  let rawdata = fs.readFileSync(absolutePath);
  let parsed = JSON.parse(rawdata)['data'];

  let return_data = [];
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]['labels'][0] === label) {
      const properties = parsed[i]['properties'];

      if (properties['Actor1Name'] == actor && properties['EventCode'] == action) {
        return_data.push(properties);
      }
    }
  }
  return return_data;
}

function getEvent(filename, label, action) {
  let absolutePath = path.resolve(cwd + '/data/' + filename);
  let rawdata = fs.readFileSync(absolutePath);
  let parsed = JSON.parse(rawdata)['data'];

  let return_data = [];
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]['labels'][0] === label) {
      const properties = parsed[i]['properties'];

      if (properties['EventCode'] == action) {
        return_data.push(properties);
      }
    }
  }
  return return_data;
}



function getTimePeriod(filename, label, start_period, stop_period) {
  let absolutePath = path.resolve(cwd + '/data/' + filename);
  let rawdata = fs.readFileSync(absolutePath);
  let parsed = JSON.parse(rawdata)['data'];

  let return_data = [];
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]['labels'][0] === label) {
      const properties = parsed[i]['properties'];

      if (properties['SQLDATE'] <= start_period && stop_period <= properties['SQLDATE']) {
        return_data.push(properties);
      }
    }
  }
  return return_data;
}


function getTone(filename, label,tone_min, tone_max) {
  let absolutePath = path.resolve(cwd + '/data/' + filename);
  let rawdata = fs.readFileSync(absolutePath);
  let parsed = JSON.parse(rawdata)['data'];

  let return_data = [];
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]['labels'][0] === label) {
      const properties = parsed[i]['properties'];

      if ( properties['AvgTone'] <= tone_min && tone_max <= properties['AvgTone']) {
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
      resolve: (MasterType,args) => {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getActionsNear(file_name, 'Master', args.lat, args.long));
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

      month_events: {
 	args: {
	   month: {
		type: GraphQLInt,
		  },
	       },			
	
      type: new GraphQLList(MasterType),
      description: 'Finds all of the news sources at specified month. Type it as YYYYMM',
      resolve: function (MasterType,args) {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getActionsMonth(file_name, 'Master', args.month));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },


      actor_and_action: {
 	args: {
	   actor: {
		type: GraphQLString,
		  },
	  action: {
		type: GraphQLString,
		  }
	       },			
	
      type: new GraphQLList(MasterType),
      description: 'Finds all of the news sources that were produced by the actor and has CAMEO code specified at action. Type it as : actor - "Donald Trump", action - "104". Both types are strings. ',
      resolve: function (MasterType,args) {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getActorAndEvent(file_name, 'Master', args.actor, args.action));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },


action: {
 	args: {
	  action: {
		type: GraphQLString,
		  },
	       },			
	
      type: new GraphQLList(MasterType),
      description: 'Finds all of the news sources that has CAMEO code specified at action. Type it as "104". Type is a string. ',
      resolve: function (MasterType,args) {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getEvent(file_name, 'Master', args.action));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },


timePeriod: {
 	args: {
	 start_period : {
		type: GraphQLInt,
		  },
	  stop_period: {
		type: GraphQLInt,
		  },
	       },			
	
      type: new GraphQLList(MasterType),
      description: 'Finds all of the news sources that appeared in specified time period. Input should look lie YYYYMMDD. Type is an integer. ',
      resolve: function (MasterType,args) {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getTimePeriod(file_name, 'Master', args.start_period, args.stop_period));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },

Tone: {
 	args: {
	  avgTone_min: {
		type: GraphQLInt,
		 },
	avgTone_max: {
		type: GraphQLInt,
		 },
	       },			
	
      type: new GraphQLList(MasterType),
      description: 'Finds all of the news sources that has a tone in specyfied range. AvgTone should be in range from -100 to 100 for both arguments. Type is a string. ',
      resolve: function (MasterType,args) {
        let all_files = fs.readdirSync('./src/graphql/data/');
        let return_data = [];
        for (let i = 0; i < all_files.length; i++) {
          const file_name = all_files[i];
          if (file_name.includes('.json')) {
            return_data.push(getTone(file_name, 'Master', args.avgTone_min, args.avgTone_max));
          }
        }
        return return_data.reduce((acc, val) => acc.concat(val), []);
      },
    },
  }),
});
module.exports = Root;
