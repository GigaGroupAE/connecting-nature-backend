const posts = require("../../models/post");
const Users = require("../../models/Register");

const getPost = async (req, res) => {
  const getpost = await posts
    .find({_id:req.body.id})
    .populate("postedby shares", {
      fullName: 1,
      phoneNumber: 1,
      profile: 1,
      type: 1,
      followers: 1,
      following: 1,
      expoPushToken: 1,
    })
    .populate({
      path: "comments",
      populate: {
        path: "commented_by",
        select: "profile fullName phoneNumber type",
      },
    });
  return res.status(200).send(getpost[0]);
};

module.exports = getPost;