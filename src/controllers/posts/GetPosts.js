const posts = require("../../models/post");
const Users = require("../../models/Register");

const getPosts = async (req, res) => {
  const getposts = await posts
    .find()
    .populate("postedby shares", {
      fullName: 1,
      phoneNumber: 1,
      profile: 1,
      type: 1,
      followers: 1,
      following: 1,
    })
    .populate({
      path: "comments",
      populate: {
        path: "commented_by",
        select: "profile fullName phoneNumber type",
      },
    });
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
