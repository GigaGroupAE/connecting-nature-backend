const DoDays = require("../../models/To-Day");

exports.LockUnlockDoday = async (req, res) => {
  try {
    let user = req.user._id;
    let DodayToBeUpdated = await DoDays.findById(req.params.id);
    if (!DodayToBeUpdated) {
      return res.json({ success: false, message: "no do-day found" });
    }

    //check if the user is actually updating  his own doday.
    //for that we'll compare the id of logined user with the id of user in doday

    if (user !== DodayToBeUpdated.createdBy.toString()) {
      return res.status(401).json({ success: false, message: "not allowed" });
    }

    //now unlocking the doday
    await DoDays.updateOne(
      { _id: DodayToBeUpdated._id },
      {
        $set: {
          locked: false,
        },
      }
    );
    return res.json({ success: true, message: "unlocked successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "internal server error" });
  }
};
