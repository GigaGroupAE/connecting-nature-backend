const campaigns = require("../../models/campaignsSchema");

const DeleteCampaignComment = async (req, res) => {
  try {
    const { comment, campaignId } = req.body;
    const getCampaign = await campaigns.findOne({ _id: campaignId });
    const newComments = getCampaign.comments.filter(
      (item) => item._id?.toString() !== comment
    );

    const updateCampaign = await campaigns
      .findByIdAndUpdate(
        { _id: campaignId },
        {
          comments: newComments,
        },
        { new: true }
      )
    if (comment) {
      return res.status(200).send({ comments: updateCampaign.comments });
    } else {
      return res.status(404).json({ error: "Campaign not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

module.exports = DeleteCampaignComment;
