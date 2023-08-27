const GroupMessages = require("../../models/groupMessageSchema");

exports.groupMessages = async (req, res, next) => {
  console.log("HIT");
  try {
    let messages = await GroupMessages.find({ group: req.params.groupId })
      .populate({ path: "from", select: "profile fullName phoneNumber type" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log("error is ", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
