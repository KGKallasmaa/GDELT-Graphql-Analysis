const master_schemas = require('../models/master.jsx');
const { transformTop } = require('../transformers.jsx');
const { filter_master_by_distance } = require('./utility/distance.jsx');

const Master = master_schemas.Master;

module.exports = {
  get_top_n_actors_with_most_mentions_per_day: async ({ n, start_SQLDATE, end_SQLDATE }) => {
    /*
    This function returns n actor for every day that had the most number of mentions per day
     */
    try {
      let res = await Master.find({ SQLDATE: { $gte: start_SQLDATE, $lte: end_SQLDATE } });
      if (!res) {
        return new Error('No results found.');
      }
      res.sort((a, b) => (a.NumMentions > b.NumMentions ? -1 : b.NumMentions > a.NumMentions ? 1 : 0));

      let top_results = {};

      for (let i = 0; i < res.length; i++) {
        let current_result = top_results[res[i]['SQLDATE']];
        if (current_result !== undefined) {
          let all_event_ids = current_result.map((x) => x['GLOBALEVENTID']);

          if (all_event_ids.includes(res[i]['GLOBALEVENTID']) === false) {
            current_result.push(res[i]);
          }
        } else {
          current_result = [res[i]];
        }
        if (current_result.length > n) {
          current_result = current_result.slice(0, n);
        }
        top_results[res[i]['SQLDATE']] = current_result;
      }

      return Object.keys(top_results).map((single_top) => {
        return transformTop(single_top, top_results[single_top]);
      });
    } catch (error) {
      throw error;
    }
  },
  get_top_n_negative_actors_near_location: async ({ n, actor1Geo_Lat, actor1Geo_Long, start_SQLDATE, end_SQLDATE }) => {
    /*
    This function returns the actors who had the lowest avg tone and who acted near a given location between two dates.
    The actor is consider near the location if it's within 100 km of the given lat and long
     */
    try {
      let res = await Master.find({ SQLDATE: { $gte: start_SQLDATE, $lte: end_SQLDATE } });
      if (!res) {
        return new Error('No results found.');
      }
      res = filter_master_by_distance(100.0, actor1Geo_Lat, actor1Geo_Long, res);
      res.sort((a, b) => (a.AvgTone > b.AvgTone ? 1 : b.AvgTone > a.AvgTone ? -1 : 0));

      let top_results = {};

      for (let i = 0; i < res.length; i++) {
        let current_result = top_results[res[i]['SQLDATE']];
        if (current_result !== undefined) {
          let all_event_ids = current_result.map((x) => x['GLOBALEVENTID']);

          if (all_event_ids.includes(res[i]['GLOBALEVENTID']) === false) {
            current_result.push(res[i]);
          }
        } else {
          current_result = [res[i]];
        }
        if (current_result.length > n) {
          current_result = current_result.slice(0, n);
        }
        top_results[res[i]['SQLDATE']] = current_result;
      }

      return Object.keys(top_results).map((single_top) => {
        return transformTop(single_top, top_results[single_top]);
      });
    } catch (error) {
      throw error;
    }
  },
};
