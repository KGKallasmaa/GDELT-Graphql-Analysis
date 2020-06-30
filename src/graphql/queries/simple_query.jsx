const master_schemas = require('../models/master.jsx');
const { transformMaster } = require('../transformers.jsx');

const Master = master_schemas.Master;

module.exports = {
  everything: async () => {
    let res = await Master.find();

    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },
  top_nr_source: async ({ n }) => {
    const res = await Master.find().sort({ NumSources: -1 }).limit(n);
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },
  get_actions_month: async ({ month }) => {
    const res = await Master.find({ MonthYear: month });
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },

  get_actions_actor: async ({ actor }) => {
    const res = await Master.find({ Actor1Name: actor });
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },

  get_actions_place: async ({ place }) => {
    const res = await Master.find({ ActionGeo_Fullname: place });
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },

  top_positive: async ({ tone, n }) => {
    const res = await Master.find({ AvgTone: { $gte: tone } })
      .sort({ AvgTone: -1 })
      .limit(n);
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },

  get_event_by_code: async ({ code, n }) => {
    const res = await Master.find({ EventCode: code }).limit(n);
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },

  get_results_between_time_periods: async ({ FractionDate_start, FractionDate_end }) => {
    const res = await Master.find({ FractionDate: { $gte: FractionDate_start, $lte: FractionDate_end } });
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },
  get_results_between_tones: async ({ min_tone, max_tone }) => {
    const res = await Master.find({ AvgTone: { $gte: min_tone, $lte: max_tone } });
    if (!res) {
      return [];
    }
    return res.map((single_res) => {
      return transformMaster(single_res);
    });
  },
};
