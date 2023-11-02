const Archives = require("../../models/archivesSchema");

exports.getArchiveCampaigns = async (req, res) => {
  try {
    let campaigns = await Archives.find({
      user: req.user._id,
      type: "campaign",
    });
    return res.json({ success: true, campaigns });
  } catch (error) {
    return res.json({ success: false, message: "internal server error " });
  }
};
