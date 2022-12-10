const notification = require("../../models/notification");

const addnotification = async (req, res) => {
  const data = req.body.data || {};
  const newnotify = new notification({
    user: req.body.user,
    body: req.body.body,
    data,
  });
  if (!newnotify) {
    return res.json({ message: "Invalid data body", success: false });
  }
  try {
    const savednoti = await newnotify.save();
    return res.json({ success: true, savednoti });
  } catch (err) {
    return res.status({ success: false, message: "some error occured" });
  }
};

module.exports = addnotification;
