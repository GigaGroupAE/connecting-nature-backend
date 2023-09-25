const GroupsModel = require("../../models/groups");

exports.addMembers = async (req, res) => {
  try {
    const group = await GroupsModel.findById(req.params.groupId);
    const { newMember } = req.body;

    console.log("new member is ", newMember);

    const updatedGroup = await GroupsModel.findByIdAndUpdate(
      group._id, // ID of the group you want to modify
      { $push: { members: newMember } },
      { new: true, runValidators: true }
    ).populate({
      path: "members.member",
      select: "fullName phoneNumber profile expoPushToken",
    });

    return res.status(200).json({ success: true, group: updatedGroup });
  } catch (error) {
    console.log("error in add members is ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
