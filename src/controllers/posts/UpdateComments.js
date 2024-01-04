// controllers/commentController.js

const posts = require("../../models/post");
const updateLikes = async (postId, commentId, likes) => {
  try {
    const post = await posts.findById(postId);

    const comment = post.comments.id(commentId);
    comment.likes = likes;

    await post.save();

    return comment.likes; 
  } catch (error) {
    console.error("Error updating likes:", error);
    throw new Error("Internal server error");
  }
};

const handleCommentAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { likes, commentId,type } = req.body;
   

    const updatedLikes = await updateLikes(id, commentId, likes);

    res.status(200).json({ likes: updatedLikes }); // Return only the updated likes array
  } catch (error) {
    console.error('Error handling comment action:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { handleCommentAction };

