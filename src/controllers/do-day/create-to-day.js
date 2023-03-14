const todaymodel = require("../../models/To-Day");
const UserModel = require("../../models/Register");

const createtoday = async (req, res) => {
  console.log(req.body);
  let user = req.user._id;

  const newtoday = new todaymodel({
    campaignName: req.body.campaignName,
    description: req.body.description,
    date: req.body.date,
    radius: req.body.radius,
    location: req.body.location,
    TeamA: req.body.TeamA,
    TeamB: req.body.TeamB,
    messages: req.body.messages,
    volunteers: req.body.volunteers,
    createdBy: user,
    endTime: req.body.endTime,
    color: req.body.color,
  });
  if (newtoday) {
    const savedtoday = await newtoday.save();
    //incrementing the user points
    await UserModel.findByIdAndUpdate(user, {
      $inc: { points: 200 },
    });
    res.status(201).send(savedtoday);
  } else {
    res.status(400).send("Invalid object body");
  }
};
module.exports = createtoday;
