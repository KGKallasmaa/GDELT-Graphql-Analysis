const transformMaster = (master) => {
  return {
    ...master._doc,
  };
};
exports.transformMaster = transformMaster;
