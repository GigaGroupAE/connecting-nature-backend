const story = require("../../models/story");

const DeleteStoryComment = async (req, res) => {
  try {
    const { comment, StoryId } = req.body;
    console.log(req.body);
    const getStory = await story.findOne({ _id: StoryId });
    const newComments = getStory.comments.filter(
      (item) => item._id?.toString() !== comment
    );

    const updateStory = await story
      .findByIdAndUpdate(
        { _id: StoryId },
        {
          comments: newComments,
        },
        { new: true }
      )
      .populate("comments.commented_by");
    if (comment) {
      return res.status(200).send({ comments: updateStory.comments });
    } else {
      return res.status(404).json({ error: "Story not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

module.exports = DeleteStoryComment;
