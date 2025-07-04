const UpgradeRequests = require("../../models/accountUpgradeSchema");
const { processAndUploadMedia } = require("../../services/mediaProcessor");

exports.addRequest = async (req, res) => {
  try {
    let user = req.user._id;
    let cnicFront = null;
    let cnicBack = null;
    let utililtyBill = null;

    if (req?.files?.cnicFront) {
      const file = req.files.cnicFront[0];
      const uploaded = await processAndUploadMedia(file, "kycDocuments");
      cnicFront = uploaded.name;
    }

    if (req?.files?.cnicBack) {
      const file = req.files.cnicBack[0];
      const uploaded = await processAndUploadMedia(file, "kycDocuments");
      cnicBack = uploaded.name;
    }

    if (req?.files?.utililtyBill) {
      const file = req.files.utililtyBill[0];
      const uploaded = await processAndUploadMedia(file, "kycDocuments");
      utililtyBill = uploaded.name;
    }

    const data = {
      ...req.body,
      cnicBack,
      cnicFront,
      utililtyBill,
      user,
    };

    await UpgradeRequests.create(data);

    return res.json({
      success: true,
      message: "Request submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting upgrade request:", error);
    return res.status(500).send("Internal Server Error");
  }
};
