const Archives = require("../../models/archivesSchema");
const postModel = require("../../models/post");

exports.getArchiveCampaigns = async (req, res) => {
  try {
    let campaigns = await Archives.find({
      //  user: req.user._id,
      type: "campaign",
    });

    let newcampaigns = [];

    for (const item of campaigns) {
      const query = { ref: item._id };
      const count = await postModel.countDocuments(query);
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
