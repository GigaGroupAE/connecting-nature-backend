const Archives = require("../../models/archivesSchema");
const CampaignModel = require("../../models/archivesSchema");

exports.addArchiveCamapaign = async (req, res) => {
  try {
    let user = req.user._id;
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
    if (user.type === "Admin") {
      return res.status(401).json({ success: false, message: "not allowed" });
    }

    await Archives.create({
      user,
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
