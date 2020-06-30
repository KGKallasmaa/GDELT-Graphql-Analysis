const master_schemas = require('../models/master.jsx');
const { transformMaster } = require('../transformers.jsx');
const { actor1_pagerank } = require('./utility/actor_pagerank.jsx');
const { filter_master_by_distance } = require('./utility/distance.jsx');
const { getDomain } = require('./utility/domain.jsx');

const Master = master_schemas.Master;

module.exports = {
  find_n_most_powerful_actor_events_using_pagerank_between_two_dates: async ({ n, start_SQLDATE, end_SQLDATE }) => {
    // Find the events between two dates
    let res = await Master.find({ SQLDATE: { $gte: start_SQLDATE, $lte: end_SQLDATE } });
    if (!res) {
      return [];
    }
    let actorname_pagerank = actor1_pagerank(res);

    // Sort actors by Pagerank
    let items = Object.keys(actorname_pagerank).map(function (key) {
      return [key, actorname_pagerank[key]];
    });

    items.sort(function (first, second) {
      return second[1] - first[1];
    });

    // Return top n
    items = items.slice(0, n);

    let actor_1_names = [];

    for (let i = 0; i < items.length; i++) {
      actor_1_names.push(items[i][0]);
    }
    let return_res = [];

    for (let i = 0; i < res.length; i++) {
      const single_res = res[i];
      if (actor_1_names.includes(single_res['Actor1Name'])) {
        const actor1_Name = single_res['Actor1Name'];
        const actor2_Name = single_res['Actor2Name'];

        const act1_is_not_undefined_or_null = actor1_Name !== undefined && actor1_Name !== null;
        const act2_is_not_undefined_or_null = actor2_Name !== undefined && actor2_Name !== null;
        const act1_and_ac2_are_not_equal = actor1_Name !== actor2_Name;
        if (act1_is_not_undefined_or_null && act2_is_not_undefined_or_null && act1_and_ac2_are_not_equal) {
          return_res.push(res[i]);
        }
      }
    }

    return return_res.map((single_res) => {
      return transformMaster(single_res);
    });
  },
  find_n_most_powerful_domains_between_two_dates: async ({ n, start_SQLDATE, end_SQLDATE, Geo_Lat, Geo_Long }) => {
    // Find the events between two dates
    let res = await Master.find({ SQLDATE: { $gte: start_SQLDATE, $lte: end_SQLDATE } });
    if (!res) {
      return [];
    }
    // Filter results by the distance to the given lat and long
    res = filter_master_by_distance(1000.0, Geo_Lat, Geo_Long, res);

    //Get actors and their pagerank
    let actorname_pagerank = actor1_pagerank(res);
    let items = Object.keys(actorname_pagerank).map(function (key) {
      return [key, actorname_pagerank[key]];
    });
    items.sort(function (first, second) {
      return second[1] - first[1];
    });

    // Calculate each Domain score

    let domain_score = {};

    for (let i = 0; i < res.length; i++) {
      const single_res = res[i];
      const url = single_res['SOURCEURL'];
      const actor1_Name = single_res['Actor1Name'];
      const actor2_Name = single_res['Actor2Name'];

      let numSources = single_res['NumSources'];
      let numMentions = single_res['NumMentions'];

      const domain = getDomain(url);

      let domain_current_score = domain_score[domain];

      if (domain_current_score === undefined) {
        domain_current_score = 0.0;
      }
      if (numSources === undefined) {
        numSources = 0.0;
      }
      if (numMentions === undefined) {
        numMentions = 0.0;
      }
      let actor1_score = actorname_pagerank[actor1_Name];
      let actor2_score = actorname_pagerank[actor2_Name];
      if (actor1_score === undefined) {
        actor1_score = 0.0;
      }
      if (actor2_score === undefined) {
        actor2_score = 0.0;
      }

      let domain_score_addition = actor1_score * actor2_score * (numMentions - numSources);
      if (Number.isNaN(domain_score_addition) === false && domain_score_addition > 0.0) {
        domain_score[domain] = domain_current_score + domain_score_addition;
      }
    }

    items = Object.keys(domain_score).map(function (key) {
      return [key, domain_score[key]];
    });

    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    let return_data = [];

    for (let i = 0; i < items.length; i++) {
      return_data.push(items[i][0]);
    }
    return return_data.slice(0, n);
  },
};
