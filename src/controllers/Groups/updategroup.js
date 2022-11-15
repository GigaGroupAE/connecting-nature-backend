const model = require("../../models/groups");
const updategroup = async (req, res) => {
  console.log(req.body);
  if (!req.params.id) {
    res.status(400).send("Invalid id");
  } else {
    try {
      const _id = req.params.id;
      const updategroup = await model.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (!updategroup) {
        res.status(500).send("internal server error");
      } else {
        res.status(200).send(updategroup);
      }
    } catch (e) {
      console.log(e);
      res.status(400).send("Invalid data body");
    }
  }
};

module.exports = updategroup;
