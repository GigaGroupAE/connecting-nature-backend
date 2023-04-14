const CampaignsModel = require("../../models/campaignsSchema");
exports.inviteVolunteer = async (req, res, next) => {
  try {
    let campaign = await CampaignsModel.findById(req.params.id);
    if (!campaign)
      return res
        .status(400)
        .json({ success: false, message: "campaign not founds" });
    
  } catch (error) {}
};
