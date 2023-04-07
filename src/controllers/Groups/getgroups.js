const groups = require("../../models/groups");

const getgroups = async (req, res) => {
  console.log("----------")
  const getgroups = await groups
    .find()
    .populate({ path: "members.member" , select:"fullName phoneNumber profile" })
    .populate("messages");

  return res.status(200).send(getgroups);
};

module.exports = getgroups;
