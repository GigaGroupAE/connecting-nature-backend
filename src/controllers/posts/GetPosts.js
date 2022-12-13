const posts = require("../../models/post");
const Users = require("../../models/Register");

const getPosts = async (req, res) => {
  const getposts = await posts.find();
  let user = await Users.findById(req.user._id);

  //filtering posts i.e checking if the post is from someone who is blocked by user
  let blockedList = user.blockedUsers;
  let blockedBy = user.blockedByUsers;
  let newPosts = getposts.filter((post) => {
    if (
      blockedList.includes(post.postedby.phoneNumber) ||
      blockedBy.includes(post.postedby.phoneNumber)
    ) {
      return false;
    }
    return true;
  });
  return res.status(200).send(newPosts);
};

module.exports = getPosts;
