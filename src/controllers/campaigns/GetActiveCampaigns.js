const CampaignModel = require("../../models/campaignsSchema");
const postModel = require("../../models/post");
exports.getActiveCampaigns = async (req, res, next) => {
  try {
    const campaigns = await CampaignModel.find({ status: "executed" }).select(
      "campaignName searchTag"
    );
    let updatedcampaigns = campaigns.map(async (item) => {
      const query = { ref: item._id };

      const count = await postModel.countDocuments(query);
      return {
        ...item,
        count: count,
      };
    });

    return res.status(200).json({ success: true, updatedcampaigns });
  } catch (error) {
    console.log("error in get all campaings is ", error);
    return res.status(200).json({ success: false, message: error.message });
  }
};
