const groups = require("../../models/groups");

const getgroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const userGroups = await groups
      .find({ "members.member": userId })
      .populate({
        path: "members.member",
        select: "fullName phoneNumber profile type expoPushToken",
      })
      .populate({
        path: "messages",
        populate: {
          path: "from",
          select: "profile fullName phoneNumber type expoPushToken",
        },
      });

    return res.status(200).send(userGroups);
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    return res.status(500).send("Server error");
  }
};

module.exports = getgroups;
