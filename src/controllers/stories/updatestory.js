const model = require("../../models/story");
const updatestory = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Invalid id");
  } else {
    try {
      const _id = req.params.id;
      const updatedstory = await model.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (!updatedstory) {
        res.status(500).send("internal server error");
      } else {
        res.status(200).send(updatedstory);
      }
    } catch (e) {
      res.status(400).send("Invalid data body");
    }
  }
};

module.exports = updatestory;
