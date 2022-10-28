const posts = require("../../models/post");

const getPosts = async (req, res) => {
  const getposts = await posts.find();
  return res.status(200).send(getposts);
};

module.exports = getPosts;
