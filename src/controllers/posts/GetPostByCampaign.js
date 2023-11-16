const PostsModel = require("../../models/post");
const UserModel = require("../../models/Register");
const Users = require("../../models/Register");

exports.getPostsByCampaign = async (req, res) => {
  try {
    let user = await Users.findById(req.user._id);
    const blockedUserIds = [...user.blockedUsers, ...user.blockedByUsers];
    const posts = await PostsModel.find({ ref: req.params.id })
      .find({ postedby: { $nin: blockedUserIds } })

      .populate("postedby shares sharedBy", {
        fullName: 1,
        phoneNumber: 1,
        profile: 1,
        type: 1,
        followers: 1,
        following: 1,
        expoPushToken: 1,
        sharedBy: 1,
      })
      .populate({
        path: "comments",
        populate: {
          path: "commented_by",
          select: "profile fullName phoneNumber type",
        },
      })
      .populate({
        path: "reactions",
        select: "profile fullName phoneNumber type",
        model: "NewUsers", // Specify the model to use for population
      })
      .populate({
        path: "sharedBy",
        populate: {
          path: "postedby",
          model: "NewUsers", // Replace 'User' with the actual model name for the postedby field
        },
      });

    return res.status(200).send({ posts });
  } catch (error) {
    console.log("error is  ", error);
  }
};
