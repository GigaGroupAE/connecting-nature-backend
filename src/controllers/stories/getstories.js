const stories = require("../../models/story");
const Users = require("../../models/Register");

const getstories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

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
      });

    let user = await Users.findById(req.user._id);

    // Get the user's blocked users' _id
    let blockedList = user.blockedUsers.map((userId) => userId.toString());
    let blockedBy = user.blockedByUsers.map((userId) => userId.toString());

    const filteredStories = allStories.filter((story) => {
      // Check if the postedby's _id is in the blocked list

      if (
        blockedList.includes(story.postedby?._id.toString()) ||
        blockedBy.includes(story.postedby?._id.toString())
      ) {
        return false;
      }
      return true;
    });



    const totalStories = filteredStories.length;
    const totalPages = Math.ceil(totalStories / limit);
    const currentPage = page;

    const paginatedStories = filteredStories.slice(
      startIndex,
      startIndex + limit
    );

    return res.status(200).json({
      totalPages,
      currentPage,
      stories: paginatedStories,
    });
  } catch (err) {
    console.error("Error fetching stories: ", err.message);
    return res.status(500).send("Server error");
  }
};

module.exports = getstories;
