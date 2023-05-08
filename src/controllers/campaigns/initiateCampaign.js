const CampaignModel = require("../../models/campaignsSchema");
const TasksModel = require("../../models/tasksSchema");

exports.initiateCampaign = async (req, res, next) => {
  try {
    const campaign = await CampaignModel.findOne({ group: req.params.groupId });
    if (!campaign)
      return res
        .status(400)
        .json({ success: false, message: "No Campaign Found" });

    let tasks = await TasksModel.find({
      campaign: campaign._id,
      status: "pending",
    });

    if (tasks.length > 0)
      return res
        .status(400)
        .json({ success: false, message: "Some Tasks are not finished" });

    //if tasks are completed then just change the status of campaign

    const updatedCampaign = await CampaignModel.findByIdAndUpdate(
      campaign._id,
      { status: "created" },
      { new: true }
    );

    return res.status(200).json({ success: true, campaign: updatedCampaign });
  } catch (error) {
    console.log("error in initiate campaign is ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
