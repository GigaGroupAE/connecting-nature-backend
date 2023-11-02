const Archives = require("../../models/archivesSchema");
const PostModel = require("../../models/post");
exports.getArchiveCampaigns = async (req, res) => {
  try {
    let campaigns = await Archives.find({
      user: req.user._id,
      type: "campaign",
    });
    let updatedcampaigns = campaigns.map(async (item) => {
      const query = { ref: item._id };

      const count = await postModel.countDocuments(query);
      return {
        ...item,
        count: count,
      };
    });
    return res.json({ success: true, updatedcampaigns });
  } catch (error) {
    return res.json({ success: false, message: "internal server error " });
  }
};
