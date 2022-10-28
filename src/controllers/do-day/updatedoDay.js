const model = require("../../models/To-Day");
const updatedoday = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Invalid id");
  } else {
    try {
      const _id = req.params.id;
      const updateddoday = await model.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (!updateddoday) {
        res.status(500).send("internal server error");
      } else {
        res.status(200).send(updateddoday);
      }
    } catch (e) {
      res.status(400).send("invalid update fields");
    }
  }
};

module.exports = updatedoday;
