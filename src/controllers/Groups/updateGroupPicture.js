const model = require("../../models/groups");
const sendMessage = require("../../services/sendmessage");

const updategroupPicture = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Invalid id");
  } else {
    try {
      // console.log(req.body.members);
      let path = "";
      if (req.file === undefined) {
        path = "no-profile-picture-placeholder.png";
      } else {
        path = req.file.filename;
      }
      const _id = req.params.id;
      const updategroup = await model
        .findByIdAndUpdate(
          _id,
          {
            groupPic: path,
          },
          {
            new: true,
          }
        )
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
    } catch (e) {
      console.log(e);
      res.status(400).send("Invalid data body");
    }
  }
};

module.exports = updategroupPicture;
