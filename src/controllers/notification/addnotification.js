const notification = require("../../models/notification");

const addnotification = async (req, res) => {
  const newnotify = new notification({
    user: req.body.user,
    body: req.body.body,
  });
  if (!newnotify) {
    res.send({ message: "Invalid data body", status: 400 });
  }
  try {
    const savednoti = await newnotify.save();
    res.send(savednoti);
  } catch (err) {
    res.send({ message: err, status: 400 });
  }
};

module.exports = addnotification;
