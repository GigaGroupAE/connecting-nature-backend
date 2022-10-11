const todays = require("../models/To-Day");

const getodays = async (req, res) => {
  try {
    const newtodays = await todays.find();
    res.status(200).send(newtodays);
  } catch (e) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = getodays;
