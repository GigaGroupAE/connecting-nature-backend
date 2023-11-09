const Archives = require("../../models/archivesSchema");
const postModel = require("../../models/post");
const CampaignModel = require("../../models/campaignsSchema");
const campaignsSchema = require("../../models/campaignsSchema");
exports.getArchiveCampaigns = async (req, res) => {
  try {
    let campaigns = await campaignsSchema.find({
      //  user: req.user._id,
      status: "archived",
    });

    let newcampaigns = [];
    for (const item of campaigns) {
      console.log(item._id);
      const query = { ref: item._id };
      const count = await postModel.countDocuments(query);
      console.log(count);
      newcampaigns.push({
        ...item._doc,
        count: count,
      });
    }

    return res.json({ success: true, newcampaigns });
  } catch (error) {
    return res.json({ success: false, message: "internal server error" });
  }
};
