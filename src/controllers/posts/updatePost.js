const model = require("../../models/post");
const updatepost = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Invalid id");
  } else {
    try {
      const _id = req.params.id;
      const updatedpost = await model.findByIdAndUpdate(_id, req.body, {
        new: true,
      });

      if (!updatedpost) {
        res.status(500).send("internal server error");
      } else {
        res.status(200).send(updatedpost);
      }
    } catch (e) {
      res.status(400).send("Invalid data body");
    }
  }
};

module.exports = updatepost;
