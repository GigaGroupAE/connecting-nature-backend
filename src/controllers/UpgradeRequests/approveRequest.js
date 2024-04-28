const UpgradeRequests = require("../../models/accountUpgradeSchema");
const Users = require("../../models/Register");
const { Expo } = require("expo-server-sdk");

exports.approveRequest = async (req, res) => {
  try {
    let id = req.params.id;

    let { newUserType, token } = req.body?.data;

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
    if (Expo.isExpoPushToken(token)) {
      const expo = new Expo(); // Create an Expo SDK client

      const messageData = {
        to: token,
        sound: "default",
        title: " Account Upgrade Approved",
        body: `We're excited to inform you that your account upgrade request to ${newUserType} status has been approved!`,
      };

      try {
        expo.sendPushNotificationsAsync([messageData]).then((tickets) => {});
      } catch (error) {
        console.log(error);
      }
    }
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
