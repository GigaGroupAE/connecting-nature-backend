const posts = require("../../models/post");
const Users = require("../../models/Register");

const DeleteComment = async (req, res) => {
  try {
    const [comment, PostId] = req.body;
    const getpost = await posts.findOne({ _id: PostId });

    const newComments = getpost.comments.filter((item) => item._id !== comment);

    const updatePost = await posts.findByIdAndUpdate(
      { _id: PostId },
      {
        comments: newComments,
      },
      { new: true }
    );

    if (comment) {
      return res.status(200).send(updatePost.omments);
    } else {
      return res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = DeleteComment;
