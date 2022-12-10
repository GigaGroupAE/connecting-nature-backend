const DoDays = require("../../models/To-Day");

//this controller will take an id of campaign as param and a phoneNumber and status as body
//and it will update the status of that phoneNumber to the provided status

exports.updateVolunteers = async (req, res) => {
  try {
    let doday = await DoDays.findById(req.params.id);
    let volunteers = doday.volunteers;

    //update volunteer status
    let updatedVolunteers = volunteers.map((m) => {
      if (m.number === req.body.phoneNumber) {
        return {
          ...m,
          status: req.body.status,
        };
      }
      return m;
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
    console.log(error);
    return res.json({ success: false, message: "internal server error" });
  }
};
