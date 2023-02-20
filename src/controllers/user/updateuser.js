const model = require("../../models/Register");
const updateuser = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Invalid id");
  } else {
    try {
      const _id = req.params.id;
      const updateduser = await model.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      if (!updateduser) {
        res.status(500).send("internal server error");
      } else {
        res.status(200).send(updateduser);
      }
    } catch (e) {
      res.status(400).send("Invalid data body");
    }
  }
};

module.exports = updateuser;
