const groups = require("../../models/groups");

const getgroupbyid = async (req, res) => {
  const getgroupbyid = await groups.findById(req.params.id);
  res.send(getgroupbyid);
};

module.exports = getgroupbyid;
