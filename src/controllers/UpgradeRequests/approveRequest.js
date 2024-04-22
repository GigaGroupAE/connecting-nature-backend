const UpgradeRequests = require("../../models/accountUpgradeSchema");
const Users = require("../../models/Register");

exports.approveRequest = async (req, res) => {
  try {
    let id = req.params.id;

    let { newUserType } = req.body;

    //finding request
    let request = await UpgradeRequests.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Upgrade request not found. Please ensure you've entered the correct ID.",
      });
    }

    //updating user
    await Users.updateOne(
      { _id: request.user },
      {
        $set: {
          type: newUserType,
        },
      }
    );

    //if we are here means that the user profile was updated successfully
    //so delete the request from the UpgradeRequests

    await UpgradeRequests.findByIdAndUpdate(request._id, {
      status: "approved",
    });

    return res.json({
      success: true,
      message: "User type updated successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message:
        "There was a problem upgrading your account. Please try again later.",
    });
  }
};
