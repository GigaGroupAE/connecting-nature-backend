const group = require("../../models/groups");

const createchat = async (req, res) => {
  console.log(req.body.members);
  const newgroup = new group({
    messages: req.body.messages,
    type: req.body.type,
    title: req.body.title,
    members: JSON.parse(req.body.members),
    groupPic: req.file.filename,
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

module.exports = createchat;
