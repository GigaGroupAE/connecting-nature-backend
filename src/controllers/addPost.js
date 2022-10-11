const post = require("../models/post");
const user = require("../models/Register");
const addpost = async (req, res) => {
  if (!req.file) {
    return res.send({ statusCode: 500, message: "no images found" });
  }
  const postedbyUser = await post.findOne({
    phoneNumber: req.body.postedby,
  });
  if (!postedbyUser) {
    res.status(400).send("Posted by invalid user");
  }
  const newpost = new post({
    postedby: req.body.postedby,
    description: req.body.description,
    media: req.file.path,
    reactions: req.body.reactions,
    comments: req.body.comments,
  });

  try {
    const savedpost = await newpost.save();
    res.send(savedpost);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = addpost;
