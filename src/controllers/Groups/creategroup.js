const group = require("../../models/groups");

const createchat = async (req, res) => {
  console.log(req.body.members);
  let path = "";
  if (req.file === undefined) {
    path = "no-profile-picture-placeholder.png";
  } else {
    path = req.file.filename;
  }
  
  const newgroup = new group({
    messages: req.body.messages,
    type: req.body.type,
    title: req.body.title,
    members: JSON.parse(req.body.members),
    groupPic: path,
  });
  if (!newgroup) {
    res.send({ message: "Invalid data body", status: 400 });
  }
  try {
    const savedgroup = await newgroup.save();
    console.log("created group is  ", savedgroup);
    res.status(200).send(savedgroup);
  } catch (err) {
    console.log("err " , err)
    res.send({ message: err, status: 400 });
  }
};

module.exports = createchat;
