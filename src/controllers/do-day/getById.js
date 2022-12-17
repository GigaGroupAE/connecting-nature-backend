const DodayModel = require("../../models/To-Day");

exports.getBYId = async (req, res) => {
  try {
    let campaign = await DodayModel.findById(req.params.id);
    return res.json({ success: true, campaign });
  } catch (error) {
    return res.json({ success: false, message: "internal server error" });
  }
};
