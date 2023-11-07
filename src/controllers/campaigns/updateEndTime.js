const CampaignModel = require("../../models/campaignsSchema");

exports.updateEndtime = async (req, res, next) => {
  console.log("update called");
  try {
    let campaign = await CampaignModel.findById(req.params.id);
    const endTime = new Date(req.body.endTime);
    if (!campaign)
      return res
        .status(400)
        .json({ success: false, message: "Campaign not found" });

    await CampaignModel.findByIdAndUpdate(campaign._id, {
      endTime: endTime,
    });

    return res.status(200).json({ success: true, campaign });
  } catch (error) {
    console.log("error is ", error.message);
    return res.status(300).json({ success: false, message: error.message });
  }
};
