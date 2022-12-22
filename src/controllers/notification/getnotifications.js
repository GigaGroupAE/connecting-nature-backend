const notification = require("../../models/notification");
const UsersModel = require("../../models/Register");
const getnotifications = async (req, res) => {

  console.log("get notifies called")
  try {
    let activeUser = await UsersModel.findById(req.user._id);

    const notifications = await notification.find({
      user: activeUser.phoneNumber,
    }).populate("data.content");
    res.status(200).send(notifications);
  } catch (e) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = getnotifications;
