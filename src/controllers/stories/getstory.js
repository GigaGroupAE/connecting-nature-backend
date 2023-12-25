const stories = require("../../models/story")
const Users = require("../../models/Register")

const getstory = async (req, res) => {
  const getstories = await stories
    .find({
      _id: req.body.id,
    })
    .populate("postedby reactions", {
      fullName: 1,
      phoneNumber: 1,
      profile: 1,
      type: 1,
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
  return res.status(200).send(getstories[0])
}

module.exports = getstory
