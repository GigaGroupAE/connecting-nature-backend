const CampaignModel = require("../../models/campaignsSchema");

exports.getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await CampaignModel.find().populate("group");
    return res.status(200).json({ success: true, campaigns });
  } catch (error) {
    console.log("error in get all campaings is ", error);
    return res.status(200).json({ success: false, message: error.message });
  }
};