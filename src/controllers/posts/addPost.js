const post = require("../../models/post");
const user = require("../../models/Register");
const addpost = async (req, res) => {
  // if (!req.file) {
  //   return res.send({ statusCode: 500, message: "no images found" });
  // }
  const newpost = new post({
    postedby: req.body.postedby,
    description: req.body.description,
    media: req.body.path,
    reactions: req.body.reactions,
    comments: req.body.comments,
    shares: req.body.shares,
  });

  try {
    const savedpost = await newpost.save();
    res.send(savedpost);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = addpost;
