const UpgradeRequests = require("../../models/accountUpgradeSchema");

// ROUTE-1 FOR USER
exports.addRequest = async (req, res) => {
  try {
    let user = req.user._id;
    let cnicFront;
    let cnicBack;
    let utililtyBill;
    if (req?.files?.cnicFront) {
      cnicFront = req?.files?.cnicFront[0]?.filename;
    }
    if (req?.files?.cnicBack) {
      cnicBack = req?.files?.cnicBack[0]?.filename;
    }
    if (req?.files?.utililtyBill) {
      utililtyBill = req?.files?.utililtyBill[0]?.filename;
    }

    const data = {
      ...req.body,
      cnicBack,
      cnicFront,
      utililtyBill,
      user,
    };
    await UpgradeRequests.create(data);
    return res.json({
      success: true,
      message: "Request submitted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
