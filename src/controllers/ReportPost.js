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
