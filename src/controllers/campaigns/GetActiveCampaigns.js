const CampaignModel = require("../../models/campaignsSchema");

exports.getActiveCampaigns = async (req, res, next) => {
  try {
    const campaigns = await CampaignModel.find({ status: "executed" }).select(
      "campaignName searchTag"
    );
    return res.status(200).json({ success: true, campaigns });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};
