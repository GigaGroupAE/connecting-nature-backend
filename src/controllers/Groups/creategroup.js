const group = require("../../models/groups");
const { processAndUploadMedia } = require("../../services/mediaProcessor");

const createchat = async (req, res) => {
  let groupPicUrl =
    "https://connecting-nature-media.s3.ap-south-1.amazonaws.com/uploads/no-profile-picture-placeholder.png";

  if (req.file !== undefined) {
    const uploaded = await processAndUploadMedia(req.file);
    groupPicUrl = uploaded.name;
  }

  const newgroup = new group({
    messages: req.body.messages,
    type: req.body.type,
    title: req.body.title,
    members: JSON.parse(req.body.members),
    groupPic: groupPicUrl,
  });
  if (!newgroup) {
    res.send({ message: "Invalid data body", status: 400 });
  }
  try {
    const savedgroup = await newgroup.save();
    console.log("created group is  ", savedgroup);
    res.status(200).send(savedgroup);
  } catch (err) {
    console.log("err ", err);
    res.send({ message: err, status: 400 });
  }
};

module.exports = createchat;
