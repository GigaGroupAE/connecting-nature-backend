const todaymodel = require("../../models/To-Day");

const createtoday = async (req, res) => {
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
  });
  if (newtoday) {
    const savedtoday = await newtoday.save();
    res.status(201).send(savedtoday);
  } else {
    res.status(400).send("Invalid object body");
  }
};
module.exports = createtoday;
