const stories = require("../../models/story");
const Users = require("../../models/Register");

const getstories = async (req, res) => {
  const getstories = await stories.find().populate("postedby reactions", {
    fullName: 1,
    phoneNumber: 1,
    profile: 1,
    type: 1,
  }).populate({
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
  let newstories = getstories.filter((post) => {
    if (
      blockedList?.includes(post.postedby.phoneNumber) ||
      blockedBy?.includes(post.postedby.phoneNumber)
    ) {
      return false;
    }
    return true;
  });
  return res.status(200).send(newstories);
};

module.exports = getstories;
