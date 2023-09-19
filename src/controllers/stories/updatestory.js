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
      const story = await model.find({_id: _id}).populate("postedby shares", {
        fullName: 1,
        phoneNumber: 1,
        profile: 1,
        type: 1,
        followers: 1,
        following: 1,
        expoPushToken: 1,
      })
      .populate({
        path: "comments",
        populate: {
          path: "commented_by",
          select: "profile fullName phoneNumber type",
        },
      })
      .populate({
        path: "reactions",
        select: "profile fullName phoneNumber type",
        model: "NewUsers",
      })
      if (!updatedstory) {
        res.status(500).send(story[0]);

      } else {
        res.status(200).send(story[0]);
      }
    } catch (e) {
      res.status(400).send("Invalid data body");
    }
  }
};

module.exports = updatestory;
