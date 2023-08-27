const model = require("../../models/groups");
const sendMessage = require("../../services/sendmessage");

const updategroup = async (req, res) => {
  console.log(req.body);
  if (!req.params.id) {
    res.status(400).send("Invalid id");
  } else {
    try {
      if (req.body.message) {
        sendMessage({
          id: req.params.id,
          message: req.body.message,
        });
        res.status(200).send("Messages Updated Successfully");
      } else {
        const _id = req.params.id;
        const updategroup = await model
          .findByIdAndUpdate(_id, req.body, {
            new: true,
          })
          .populate({
            path: "members.member",
          })
          .populate({
            path: "members.privilege",
          });

        console.log(updategroup, "update");
        if (!updategroup) {
          res.status(500).send("internal server error");
        } else {
          res.status(200).send(updategroup);
        }
      }
    } catch (e) {
      console.log(e);
      res.status(400).send("Invalid data body");
    }
  }
};

module.exports = updategroup;
