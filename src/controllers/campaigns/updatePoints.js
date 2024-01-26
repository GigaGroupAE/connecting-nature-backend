const CampaignModel = require("../../models/campaignsSchema");
const BucketModel = require("../../models/bucketsSchema");

exports.updatePoints = async (req, res) => {
  try {
    const campaign = await CampaignModel.findById(req.params.campaignId);
    if (!campaign)
      return res
        .status(400)
        .json({ success: true, message: "Campaign Not Found" });

    const { teamName, bucketId, bucketCount } = req.body;

    const bucket = await BucketModel.findById(bucketId);
    if (!bucket)
      return res
        .status(400)
        .json({ success: false, message: "No Bucket found" });

    campaign[teamName].points += bucket.points * bucketCount;

    const updateCampaign = await campaign.save();

    return res.status(200).json({ success: true, campaign: updateCampaign });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
