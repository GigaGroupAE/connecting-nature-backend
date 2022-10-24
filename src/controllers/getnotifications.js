const notification = require("../models/notification");

const getnotifications = async (req, res) => {
  try {
    const notifications = await notification.find();
    res.status(200).send(notifications);
  } catch (e) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = getnotifications;
