const chats = require("../../models/chats");

const getchats = async (req, res) => {
  const getchats = await chats.find();
  return res.status(200).send(getchats);
};

module.exports = getchats;
