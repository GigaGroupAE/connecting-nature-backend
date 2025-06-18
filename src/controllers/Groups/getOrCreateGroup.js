const Group = require("../../models/groups");

exports.getOrCreateGroup = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  console.log(userId, id);

  try {
    const existingGroup = await Group.findOne({
      type: "individual",
      $and: [
        { "members.member": userId }, // Check if userId is a member of the group
        { "members.member": id }, // Check if id is also a member of the group
      ],
    })
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

    if (existingGroup) {
      return res.json({ group: existingGroup });
    }

    // If no group exists, create a new one
    const newGroup = new Group({
      title: "test", // You can customize this
      type: "individual",
      members: [{ member: userId }, { member: id }],
      groupPic:
        "https://connecting-nature-media.s3.ap-south-1.amazonaws.com/uploads/no-profile-picture-placeholder.png",
    });

    const savedGroup = await newGroup.save();

    // Now, populate the savedGroup
    const populatedGroup = await Group.findById(savedGroup._id)
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

    res.json({ group: populatedGroup });
  } catch (error) {
    console.error("Error selecting contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
