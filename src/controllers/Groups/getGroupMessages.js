const GroupModel = require("../../models/groups");
const GroupMessages = require("../../models/groupMessageSchema");

exports.getGroupMessages = async (req, res, next) => {
  try {
    const limit = 20; // the number of documents per page

    let messages = await GroupMessages.find({ group: req.params.groupId })
      .populate({ path: "from", select: "profile fullName phoneNumber type" })
      .sort({ date: -1 })
      .skip((req.query.page - 1) * limit)
      .limit(limit);

    const totalItems = await GroupMessages.countDocuments({
      group: req.params.groupId,
    });
    const totalPages = Math.ceil(totalItems / limit);

    console.log("messages ", messages);

    return res.status(200).json({ success: true, totalPages, messages });
  } catch (error) {
    console.log("error is ", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
