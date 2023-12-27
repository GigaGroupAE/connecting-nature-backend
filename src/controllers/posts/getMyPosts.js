const PostsModel = require("../../models/post")
const UserModel = require("../../models/Register")

exports.getUserPosts = async (req, res) => {
  try {
    let { page, limit, lastPostId } = req.query

    page = parseInt(page) || 1
    limit = parseInt(limit) || 10

    let query = {}

    const user = await UserModel.findOne({
      phoneNumber: req.params.phoneNumber,
    })

    if (!user) {
      return res.status(404).send("User not found")
    }

    query.postedby = user._id

    if (lastPostId) {
      query._id = { $lt: lastPostId }
    }

    const totalItems = await PostsModel.countDocuments({ postedby: user._id })
    const totalPages = Math.ceil(totalItems / limit)

    const posts = await PostsModel.find(query)
      .sort({ createdAT: "desc" })
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
      .limit(limit)

    return res.status(200).send({ posts, totalPages, currentPage: page })
  } catch (error) {
    console.log("Error:", error)
    return res.status(500).send("Server error")
  }
}

exports.getUserTotalPostCount = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      phoneNumber: req.params.phoneNumber,
    })

    const totalItems = await PostsModel.countDocuments({ postedby: user._id })

    return res.status(200).send({ totalItems })
  } catch (error) {
    console.log("Error:", error)
    return res.status(500).send("Server error")
  }
}
