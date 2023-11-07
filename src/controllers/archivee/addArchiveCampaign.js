const Archives = require("../../models/archivesSchema");
const CampaignModel = require("../../models/campaignsSchema");

exports.addArchiveCamapaign = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.json({ success: false, message: "invalid id " });
    }

    //find post
    let archive = await CampaignModel.findById(req.params.id)
      .populate(
        "group volunteers.user teamA.members teamB.members teamA.leader teamB.leader"
      )
      .populate({
        path: "reactions",
        select: "profile fullName phoneNumber type",
        model: "NewUsers",
      });

    //check if user is actually archiving his own posts

    await Archives.create({
      type: "campaign",
      data: archive,
    });
    await CampaignModel.findByIdAndUpdate(
      { _id: archive._id },
      { status: "archived" },
      { new: true }
    );

    return res.json({ success: true, message: "archived successfully" });
  } catch (error) {
    return res.json({ success: false, message: "internal server error " });
  }
};
