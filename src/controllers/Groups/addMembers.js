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

exports.updateUserPrivilege = async (req, res) => {
  try {
    const { role, groupId, userId } = req.body;

    if (!role || !groupId || !userId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const group = await GroupsModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const memberIndex = group.members.findIndex(
      (member) => member?._id.toString() === userId
    );
    if (memberIndex === -1) {
      return res.status(404).json({
        message:
          "The user you are trying to update is not a member of this group. Please check the user ID and try again",
      });
    }

    group.members[memberIndex].privilege = role;

    await group.save();

    return res
      .status(200)
      .json({ message: "User privilege has been updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        "An unexpected error occurred while updating the user privilege. Please try again later.",
    });
  }
};
