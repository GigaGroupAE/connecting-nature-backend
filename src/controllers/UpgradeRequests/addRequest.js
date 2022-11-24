const UpgradeRequests = require("../../models/accountUpgradeSchema");

// ROUTE-1 FOR USER
exports.addRequest = async (req, res) => {
  try {
    let user = req.user._id;
    let request = await UpgradeRequests.create({ ...req.body, user });

    return res.json({ success: true, request });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
