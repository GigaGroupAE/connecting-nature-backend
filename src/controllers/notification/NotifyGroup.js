const { Expo } = require("expo-server-sdk");
const expo = new Expo({
  useFcmV1: true,
});

const notifyGroup = async (req, res) => {
  try {
    const users = req.body.user;
    const senderName = req.body.senderName;
    const groupTitle = req.body.groupTitle;
    const title = "New Message";

    for (const user of users) {
      // Check if the user has an Expo Push Token
      if (Expo.isExpoPushToken(user.expoPushToken)) {
        const message = `You have a new message from ${senderName} in the ${groupTitle} group.`;

        const messageData = {
          to: user.expoPushToken,
          sound: "default",
          title,
          body: message,
        };

        try {
          await expo.sendPushNotificationsAsync([messageData]);
          console.log("Notification sent to:", user.fullName);
        } catch (error) {
          console.log("Error sending notification to", user.fullName, error);
        }
      }
    }

    return res.json({
      success: true,
      message: "Notifications sent successfully",
    });
  } catch (error) {
    console.log("Error inside notifyGroup:", error);
    return res.json({ success: false, error });
  }
};

module.exports = notifyGroup;
