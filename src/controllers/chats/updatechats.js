const Messages = require("../../models/messageSchema");
const updatechat = async (req, res) => {
  const { messageId, newStatus } = req.body;

  try {
    const message = await Messages.findByIdAndUpdate(
      messageId,
      { $set: { status: newStatus } },
      { new: true }
    );

    if (message) {
      res.status(200).json({
        message: "Message status updated successfully",
        updatedMessage: message,
      });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updatechat;
