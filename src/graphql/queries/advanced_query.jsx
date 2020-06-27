const master_schemas = require('../models/master.jsx');
const { transformMaster } = require('../transformers.jsx');

const Master = master_schemas.Master;

module.exports = {
  //TODO: it's not implemented
  find_n_most_powerful_actor_events_using_pagerank_between_two_dates: async ({ n, start_SQLDATE, end_SQLDATE }) => {
    // Find the events between two dates
    let res = await Master.find({ SQLDATE: { $gte: start_SQLDATE, $lte: end_SQLDATE } });
    if (!res) {
      return [];
    }
    // Build the pagerank graph
    let actorname_nr = {}; // Key = actor_name  Value = Actor nr
    let graph = require('pagerank.js');

    let actor_nr = 0;
    for (let i = 0; i < res.length; i++) {
      const single_res = res[i];
      const actor1_Name = single_res['Actor1Name'];
      const actor2_Name = single_res['Actor2Name'];

      const act1_is_not_undefined_or_null = actor1_Name !== undefined && actor1_Name !== null;
      const act2_is_not_undefined_or_null = actor2_Name !== undefined && actor2_Name !== null;
      const act1_and_ac2_are_not_equal = actor1_Name !== actor2_Name;

      if (act1_is_not_undefined_or_null && act2_is_not_undefined_or_null && act1_and_ac2_are_not_equal) {
        let actor1_code = actorname_nr[actor1_Name];
        let actor2_code = actorname_nr[actor2_Name];

        if (actor1_code === undefined) {
          actor1_code = actor_nr;
          actorname_nr[actor1_Name] = actor_nr;
          actor_nr += 1;
        }
        if (actor2_code === undefined) {
          actor2_code = actor_nr;
          actorname_nr[actor2_Name] = actor_nr;
          actor_nr += 1;
        }
        graph.link(actor1_Name, actor2_Name, 1.0);
      }
    }

    // Execute tha Pagerank algorithm

    let actorname_pagerank = {};
    graph.rank(0.85, 0.000001, function (node, rank) {
      //  console.log('Node ' + node + ' has a rank of ' + rank);
      actorname_pagerank[node] = rank;
    });

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
};
