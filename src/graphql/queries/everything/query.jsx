const master_schemas = require('../../models/master.jsx');
const { transformMaster } = require('../../transformers.jsx');

const Master = master_schemas.Master;

module.exports = {
  everything: async () => {
    try {
      const res = await Master.find();
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
};
