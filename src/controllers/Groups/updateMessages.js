const model = require("../../models/groups");
const updategroup = async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  console.log(req.params.id);
  //   if (!req.params.id) {
  //     res.status(400).send("Invalid id");
  //   } else {
  //     try {
  //       const _id = req.params.id;
  //       const group = await model.findById(_id);
  //       group.messages.push(red.body);
  //       const updategroup = await model.findByIdAndUpdate(_id, group.messages, {
  //         new: true,
  //       });
  //       if (!updategroup) {
  //         res.status(500).send("internal server error");
  //       } else {
  //         res.status(200).send(updategroup);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       res.status(400).send("Invalid data body");
  //     }
  //   }
};

module.exports = updategroup;
