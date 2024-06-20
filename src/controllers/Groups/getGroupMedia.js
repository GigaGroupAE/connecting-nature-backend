const groups = require("../../models/groups");

const getgroupMedia = async (req, res) => {
  try {
    const group = await groups
      .findById(req.params.id)
      .select("messages")
      .populate({
        path: "messages",
      });
    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }
    res.send(group.messages);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
};

module.exports = getgroupMedia;
