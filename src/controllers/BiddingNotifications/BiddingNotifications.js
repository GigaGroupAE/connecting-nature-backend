const notification = require("../../models/CrmNotification");
const { Expo } = require("expo-server-sdk");

exports.addcrmNotifications = async (req, res) => {
  console.log("Adding notification...");
  console.log(req.body);
  const requestData = req.body.data || {};
  const newNotification = new notification({
    user: req.body.user,
    body: req.body.body,
    data: requestData,
  });

  if (!newNotification) {
    return res.json({
      message: "Failed to create notification. Please provide valid data.",
      success: false,
    });
  }

  try {
    const pushToken = req.body.body.user.expoPushToken;

    let title = "";
    let message = "";

    if (Expo.isExpoPushToken(pushToken)) {
      const expo = new Expo(); // Create an Expo SDK client

      if (req.body.data.title === "req-approve") {
        title = "Subscription Request Approved";
        message =
          "Your subscription request has been approved. You are now able to bid on properties.";
      } else if (req.body.data.title === "req-denied") {
        title = "Subscription Request Denied";
        message =
          "Unfortunately, your subscription request for the channel has been denied by the administrators.";
      } else if (req.body.data.title === "new-bid") {
        title = "New Bid Placed";
        message = `${req.body.body.user.fullName} has placed a new bid on a property. Stay updated with the latest bids!`;
      } else if (req.body.data.title === "bid-winner") {
        title = "Bid Winner Announced";
        message = `${req.body.body.user.fullName} has won the bid on a property. Congratulations!`;
      }

      const messageData = {
        to: pushToken,
        sound: "default",
        title,
        body: message,
      };

      try {
        const tickets = await expo.sendPushNotificationsAsync([messageData]);
        console.log("Notification sent:", tickets);
      } catch (error) {
        console.log("Error sending notification:", error);
      }
    }

    const savedNotification = await newNotification.save();
    return res.json({ success: true, savedNotification });
  } catch (err) {
    console.log("Error:", err);
    return res.status({
      success: false,
      message: "An error occurred while processing the request",
    });
  }
};

exports.getAllNotificationsForUser = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming userId is passed in the request params

    const notifications = await notification.find({ user: userId });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.notifynewBid = async (req, res) => {
  try {
    const users = req.body.user;
    const senderName = req.body.senderName;
    const groupTitle = req.body.groupTitle;
    const title = "New Bid Placed";

    const body = {
      userCode: senderName,
      projectTitle: groupTitle,
    };

    const data = {
      title,
    };

    for (const user of users) {
      // Check if the user has an Expo Push Token
      if (Expo.isExpoPushToken(user.expoPushToken)) {
        const expo = new Expo();
        const message = `${senderName} has placed a new bid on a ${groupTitle}. Stay updated with the latest bids!`;
        const newNotification = new notification({
          user: user?._id,
          body,
          data,
        });

        const messageData = {
          to: user?.expoPushToken,
          sound: "default",
          title,
          body: message,
        };

        try {
          await expo.sendPushNotificationsAsync([messageData]);
          const savedNotification = await newNotification.save();
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
