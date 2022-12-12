const DoDays = require("../../models/To-Day");

exports.updateMultipleVolunteers = async (req, res) => {
  try {
    let doday = await DoDays.findById(req.params.id);
    let usersToUpdate = req.body;
    let volunteers = doday.volunteers;

    let updatedVolunteers = volunteers.map((v) => {
      if (usersToUpdate.includes(v.number)) {
        return {
          ...v,
          status: "sent",
        };
      }
      return v;
    });

    await DoDays.updateOne(
      { _id: doday._id },
      {
        $set: {
          volunteers: updatedVolunteers,
        },
      }
    );
    return res.json({ success: true, updatedVolunteers });
  } catch (error) {
    return res.json({ success: false, message: "internal server error" });
  }
};
