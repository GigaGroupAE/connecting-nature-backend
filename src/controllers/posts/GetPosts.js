const posts = require("../../models/post");
const Users = require("../../models/Register");

exports.getPosts = async (req, res) => {
  const getposts = await posts
    .find()
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
    })
    .populate("sharedBy")
    .populate({
      path: "sharedBy",
      populate: {
        path: "postedby",
        model: "NewUsers", // Replace 'User' with the actual model name for the postedby field
      },
    });
  let user = await Users.findById(req.user._id);

  //filtering posts i.e checking if the post is from someone who is blocked by user
  let blockedList = user.blockedUsers;
  let blockedBy = user.blockedByUsers;
  let newPosts = getposts.filter((post) => {
    if (
      blockedList?.includes(post.postedby._id) ||
      blockedBy?.includes(post.postedby._id)
    ) {
      return false;
    }
    return true;
  });
  return res.status(200).send(newPosts);
};

// exports.postsExperiment = async (req, res) => {
//   try {
//     let user = await Users.findById(req.user._id);
//     const blockedUserIds = [...user.blockedUsers, ...user.blockedByUsers];

//     const page = parseInt(req.query.page);
//     const limit = parseInt(req.query.limit);
//     const startIndex = (page - 1) * limit;
//     const newPosts = await posts
//       .find({ postedby: { $nin: blockedUserIds } })
//       .sort({ createdAT: "desc" })
//       .populate("postedby shares", {
//         fullName: 1,
//         phoneNumber: 1,
//         profile: 1,
//         type: 1,
//         followers: 1,
//         following: 1,
//         expoPushToken: 1,
//       })
//       .populate({
//         path: "comments",
//         populate: {
//           path: "commented_by",
//           select: "profile fullName phoneNumber type",
//         },
//       })
//       .populate({
//         path: "reactions",
//         select: "profile fullName phoneNumber type",
//       })
//       .populate("sharedBy")
//       .populate({
//         path: "sharedBy",
//         populate: {
//           path: "postedby",
//           model: "NewUsers",
//         },
//       })
//       .skip(startIndex)
//       .limit(limit)
//       .exec();
//     const postsToCount = await posts.find({
//       postedby: { $nin: blockedUserIds },
//     });
//     const count = postsToCount.length;
//     const totalPages = Math.ceil(count / limit);
//     const currentPage = page;

//     // Return the posts and pagination info as JSON response
//     return res.json({ totalPages, currentPage, newPosts });
//   } catch (err) {
//     console.error("error inside get posts is  ", err.message);
//     return res.status(500).send("Server error");
//   }
// };

// Controller: postsExperiment
exports.postsExperiment = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  try {
    const user = await Users.findById(req.user._id)
      .select("blockedUsers blockedByUsers")
      .lean();

    if (!user) return res.status(404).json({ error: "User not found" });

    const blockedUserIds = [...user.blockedUsers, ...user.blockedByUsers];

    const [newPosts, totalPosts] = await Promise.all([
      posts
        .find({ postedby: { $nin: blockedUserIds } })
        .sort({ createdAT: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("postedby shares", {
          fullName: 1,
          phoneNumber: 1,
          profile: 1,
          type: 1,
          expoPushToken: 1,
        })
        .populate({
          path: "comments",
          options: { limit: 10 },
          populate: {
            path: "commented_by",
            select: "profile fullName",
          },
        })
        .populate({
          path: "reactions",
          options: { limit: 20 },
          select: "profile fullName",
        })
        .populate({
          path: "sharedBy",
          populate: {
            path: "postedby",
            select: "fullName profile",
          },
        })
        .lean(),

      posts.countDocuments({ postedby: { $nin: blockedUserIds } }),
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
    const hasMore = page < totalPages;

    return res.json({
      totalPages,
      currentPage: page,
      hasMore,
      newPosts,
    });
  } catch (err) {
    console.error("Error in postsExperiment:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    if (!searchQuery) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    const user = await Users.findById(req.user._id);
    const blockedUserIds = [...user.blockedUsers, ...user.blockedByUsers];

    const searchResult = await posts
      .find({
        $and: [
          { postedby: { $nin: blockedUserIds } },
          { description: { $regex: new RegExp(searchQuery, "i") } },
        ],
      })
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
      })
      .populate({
        path: "reactions",
        select: "profile fullName phoneNumber type",
      })
      .populate("sharedBy")
      .populate({
        path: "sharedBy",
        populate: {
          path: "postedby",
          model: "NewUsers",
        },
      });

    return res.json({ searchResult });
  } catch (err) {
    console.error("Error searching posts:", err.message);
    return res.status(500).send("Server error");
  }
};
