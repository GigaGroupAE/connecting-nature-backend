const todays = require("../../models/To-Day");

const getodays = async (req, res) => {
  console.log("get dodays called")
  try {
    const newtodays = await todays
      .find({ status: "active" })
      .populate("createdBy");
    res.status(200).send(newtodays);
  } catch (e) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = getodays;
