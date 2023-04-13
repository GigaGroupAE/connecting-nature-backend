const GroupsModel = require("../../models/groups");
const CampaignsModel = require("../../models/campaignsSchema");
const TasksModel = require("../../models/tasksSchema");
//for session
const mongoose = require("mongoose");
exports.createCampaign = async (req, res, next) => {
  const {
    campaignName,
    description,
    startTime,
    endTime,
    radius,
    volunteersRequired,
    searchTag,
  } = req.body;

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    //group for a campaign
    const campaignGroup = await GroupsModel.create(
      [
        {
          title: campaignName,
          type: "campaign",
          groupPic: "no-profile-picture-placeholder.png",
          members: [{ member: req.user._id, privilege: "Owner" }],
          messages: [],
        },
      ],
      { session }
    );
    const campaign = await CampaignsModel.create(
      [
        {
          campaignName,
          description,
          startTime,
          endTime,
          radius,
          volunteersRequired,
          searchTag,
          group: campaignGroup[0]._id,
          createdBy: req.user._id,
        },
      ],
      { session }
    );
    let tasksTocreate = [
      {
        title: "Get NOC from Government",
        description: "Get NOC from Government",
        created_by: req.user._id,
        campaign: campaign[0]._id,
      },
      {
        title: "Complete Estimated User",
        description: `Complete the number of volunteers required. - ${volunteersRequired} volunteers `,
        created_by: req.user._id,
        campaign: campaign[0]._id,
      },
      {
        title: "Get Volunteers Trained",
        description: "Train the volunteers",
        created_by: req.user._id,
        campaign: campaign[0]._id,
      },
    ];

    //tasks for campaign
    const tasks = await TasksModel.create(tasksTocreate, { session });

    //transforming the tasks into ids

    const taskIds = tasks.map((task) => task._id);

    let updatedCampaign = await CampaignsModel.findByIdAndUpdate(
      campaign[0]._id,
      { tasks: taskIds },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Campaign Created Successfully",
      updatedCampaign,
    });
  } catch (error) {
    console.log("error in create campaign is ", error);
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ success: false, message: error.message });
  }
};
