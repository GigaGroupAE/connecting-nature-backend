const reportPost = require("../models/ReportPost");

exports.createReportPost = async (req, res) => {
  try {
    const { postId, reportedBy, reasons } = req.body.reportData;

    const newReport = new reportPost({
      postId,
      reportedBy,
      reasons,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: "Failed to create report", error });
  }
};
exports.getReportPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const reportedPosts = await reportPost
      .find({})
      .sort({ createdAt: "desc" })
      .populate("postId")
      .populate({
        path: "postId",
        populate: {
          path: "postedby",
          model: "NewUsers",
        },
      })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const count = await reportPost.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const currentPage = page;

    if (reportedPosts && reportedPosts.length > 0) {
      return res.json({ totalPages, currentPage, reportedPosts });
    } else {
      return res.status(404).json({ error: "No reported posts found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.removeReportedPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await reportPost.findOneAndDelete({ postId: id });

    if (!post) {
      return res.status(404).json({ error: "Reported post not found" });
    }

    return res
      .status(200)
      .json({ message: "Reported post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
