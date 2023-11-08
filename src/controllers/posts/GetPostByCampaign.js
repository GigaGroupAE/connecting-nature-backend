const PostsModel = require("../../models/post");
const UserModel = require("../../models/Register");

exports.getPostsByCampaign = async (req, res) => {
  try {
    const posts = await PostsModel.find({ ref: req.params.id })
      .populate("postedby shares", {
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
      });

    return res.status(200).send({ posts });
  } catch (error) {
    console.log("error is  ", error);
  }
};
