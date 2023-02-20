const groups = require("../../models/groups");

const getgroups = async (req, res) => {
  const getgroups = await groups.find();
  return res.status(200).send(getgroups);
};

module.exports = getgroups;
