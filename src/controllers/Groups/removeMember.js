const GroupsModel = require("../../models/groups");

exports.removeMember = async (req, res) => {
  try {
    const group = await GroupsModel.findById(req.params.groupId);
    const { memberId } = req.body;

    const updatedGroup = await GroupsModel.findByIdAndUpdate(
      group._id,
      { $pull: { members: { member: memberId } } },
      { new: true }
    ).populate({
      path: "members.member",
      // select: "fullName phoneNumber profile",
    });

    return res.status(200).json({ success: true, group: updatedGroup });
  } catch (error) {
    console.log("error in add members is ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
