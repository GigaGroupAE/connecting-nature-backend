const CampaignModel = require("../../models/campaignsSchema");

exports.getMostRecentCampaign = async (req, res, next) => {
  try {
    const campaigns = await CampaignModel.find()
      .sort({ startDate: -1 }) // Sort by startDate in descending order (most recent first)
      .limit(1)
      .select("campaignName searchTag");
    return res.status(200).json({ success: true, campaigns: campaigns[0] });
  } catch (error) {
    console.log("error in get all campaings is ", error);
    return res.status(200).json({ success: false, message: error.message });
  }
};
