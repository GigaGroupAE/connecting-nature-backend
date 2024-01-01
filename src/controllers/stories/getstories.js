const stories = require("../../models/story")
const Users = require("../../models/Register")

const getstories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit

    const allStories = await stories
      .find()
      .sort({ createdAT: "desc" })
      .populate("postedby reactions", {
        fullName: 1,
        phoneNumber: 1,
        profile: 1,
        type: 1,
      })
      .populate({
        path: "comments",
        populate: {
          path: "commented_by",
          select: "profile fullName phoneNumber type",
        },
      })

    let user = await Users.findById(req.user._id)

    // Filter posts based on blocked users
    let blockedList = user.blockedUsers
    let blockedBy = user.blockedByUsers
    const filteredStories = allStories.filter((post) => {
      if (
        blockedList?.includes(post.postedby.phoneNumber) ||
        blockedBy?.includes(post.postedby.phoneNumber)
      ) {
        return false
      }
      return true
    })

    const totalStories = filteredStories.length
    const totalPages = Math.ceil(totalStories / limit)
    const currentPage = page

    const paginatedStories = filteredStories.slice(
      startIndex,
      startIndex + limit
    )

    return res.status(200).json({
      totalPages,
      currentPage,
      stories: paginatedStories,
    })
  } catch (err) {
    console.error("Error fetching stories: ", err.message)
    return res.status(500).send("Server error")
  }
}

module.exports = getstories
