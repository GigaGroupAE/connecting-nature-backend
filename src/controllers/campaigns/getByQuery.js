const CampaignModel = require("../../models/campaignsSchema");

exports.getByQuery = async (req, res, next) => {
  try {
    const campaign = await CampaignModel.findOne(req.query).populate(
      "group volunteers.user teamA.members teamB.members teamA.leader teamB.leader"
    );
    return res.status(200).json({ success: true, campaign });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};

exports.getMultipleByQuery = async (req, res, next) => {
  try {
    const campaigns = await CampaignModel.find(req.query)
      .populate(
        "group volunteers.user teamA.members teamB.members teamA.leader teamB.leader"
      )
      .populate({
        path: "reactions",
        select: "profile fullName phoneNumber type",
        model: "NewUsers",
      })
      .populate({
        path: "comments",
        populate: {
          path: "commented_by",
          select: "profile fullName phoneNumber type",
        },
      });
    return res.status(200).json({ success: true, campaigns });
  } catch (error) {
    return res.status(200).json({ success: false, message: error.message });
  }
};
