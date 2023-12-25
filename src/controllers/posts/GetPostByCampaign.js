const PostsModel = require("../../models/post")
const UserModel = require("../../models/Register")
const Users = require("../../models/Register")

exports.getPostsByCampaign = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id)
    const blockedUserIds = [...user.blockedUsers, ...user.blockedByUsers]

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit

    const posts = await PostsModel.find({ ref: req.params.id })
      .find({ postedby: { $nin: blockedUserIds } })
      .sort({ createdAT: "desc" }) // Sorting by createdAt in descending order
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
        model: "NewUsers",
      })
      .populate({
        path: "sharedBy",
        populate: {
          path: "postedby",
          model: "NewUsers",
        },
      })
      .skip(startIndex)
      .limit(limit)

    const postsToCount = await PostsModel.find({ ref: req.params.id }).find({
      postedby: { $nin: blockedUserIds },
    })
    const count = postsToCount.length
    const totalPages = Math.ceil(count / limit)
    const currentPage = page

    return res.status(200).send({ totalPages, currentPage, posts })
  } catch (error) {
    console.log("Error:", error)
    return res.status(500).send("Server error")
  }
}
