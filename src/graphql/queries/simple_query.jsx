const master_schemas = require('../models/master.jsx');
const { transformMaster } = require('../transformers.jsx');

const Master = master_schemas.Master;

module.exports = {
  everything: async () => {
    try {
      let res = await Master.find();

      if (!res) {
        return new Error('No results found.');
      }
      return res.map((single_res) => {
        return transformMaster(single_res);
      });
    } catch (error) {
      throw error;
    }
  },
  top_nr_score: async ({ n }) => {
    try {
      const res = await Master.find().sort({ NumSources: -1 }).limit(n);
      if (!res) {
        return new Error('No results found.');
      }
      return res.map((single_res) => {
        return transformMaster(single_res);
      });
    } catch (error) {
      throw error;
    }
  },
  get_actions_month: async ({ month }) => {
    try {
      const res = await Master.find({ MonthYear: month });
      if (!res) {
        return new Error('No results found.');
      }
      return res.map((single_res) => {
        return transformMaster(single_res);
      });
    } catch (error) {
      throw error;
    }
  },
  get_results_between_time_periods: async ({ FractionDate_start, FractionDate_end }) => {
    try {
      const res = await Master.find({ FractionDate: { $gte: FractionDate_start, $lte: FractionDate_end } });
      if (!res) {
        return new Error('No results found.');
      }
      return res.map((single_res) => {
        return transformMaster(single_res);
      });
    } catch (error) {
      throw error;
    }
  },
  get_results_between_tones: async ({ min_tone, max_tone }) => {
    try {
      const res = await Master.find({ AvgTone: { $gte: min_tone, $lte: max_tone } });
      if (!res) {
        return new Error('No results found.');
      }
      return res.map((single_res) => {
        return transformMaster(single_res);
      });
    } catch (error) {
      throw error;
    }
  },
};
