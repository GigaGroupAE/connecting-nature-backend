const GroupsModel = require("../../models/groups");
const CampaignsModel = require("../../models/campaignsSchema");
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
        },
      ],
      { session }
    );
    //TODO : CREATE GROUP

    await session.commitTransaction();

    session.endSession();

    return res
      .status(200)
      .json({ success: true, message: "Campaign Created Successfully" });
  } catch (error) {
    console.log("error in create campaign is ", error);
    await session.abortTransaction();
    session.endSession();
  }
};
