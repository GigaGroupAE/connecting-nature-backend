const posts = require("../../models/post");
const Users = require("../../models/Register");

const DeleteComment = async (req, res) => {
  try {
    const { comment, PostId } = req.body;
    const getpost = await posts.findOne({ _id: PostId });

    console.log(getpost?.comments?.filter((item) => console.log(item._id)));

    const newComments = getpost.comments.filter(
      (item) => item._id?.toString() !== comment
    );

    const updatePost = await posts
      .findByIdAndUpdate(
        { _id: PostId },
        {
          comments: newComments,
        },
        { new: true }
      )
      .populate("comments.commented_by");
    if (comment) {
      return res.status(200).send(updatePost.comments);
    } else {
      return res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = DeleteComment;
