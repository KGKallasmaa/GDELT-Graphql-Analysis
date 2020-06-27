const transformMaster = (master) => {
  return {
    ...master._doc,
  };
};

const transformTop = (key, value) => {
  return {
    SQLDATE: key,
    events: value.map((single_res) => {
      return transformMaster(single_res);
    }),
  };
};

exports.transformMaster = transformMaster;
exports.transformTop = transformTop;
