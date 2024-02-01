const notification = require("../../models/notification");

const deleteNoties = async (req, res) => {
  try {
    const contentId = req.params.id;

    const result = await notification.deleteMany({
      "data.content": contentId,
    });

    res.json({
      message: `${result.deletedCount} notifications deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = deleteNoties;
