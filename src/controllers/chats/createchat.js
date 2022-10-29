const chats = require("../../models/chats");

const creategroup = async (req, res) => {
  const newgroup = new chats({
    messages: req.body.messages,
    type: req.body.type,
    title: req.body.title,
    members: req.body.members,
  });
  if (!newgroup) {
    res.send({ message: "Invalid data body", status: 400 });
  }
  try {
    const savedgroup = await newgroup.save();
    res.status(200).send(savedgroup);
  } catch (err) {
    res.send({ message: err, status: 400 });
  }
};

module.exports = creategroup;
