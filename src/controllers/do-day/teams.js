const Campaigns = require("../../models/To-Day");
const UserModel = require("../../models/Register");

//this function will take campaign id as param
//and will also take a volunteer object and team name as req.body
//it will push the volunteer to that teams members list
//and update the volunteers list and add team name feild to that volunteer
exports.addVolunteerToTeam = async (req, res) => {
  try {
    let doday = await Campaigns.findById(req.params.id);
    if (!doday) {
      return res.json({ success: false, message: "do-day does not exist" });
    }

    const { teamName, volunteer } = req.body;

    let team = doday[teamName];
    let members = team.members;
    members.push(volunteer);

    //removing volunteer from volunteers list
    let volunteers = doday.volunteers;

    let updatedVolunteers = volunteers.map((v) => {
      if (v.number === volunteer.number) {
        return {
          ...v,
          team: teamName,
        };
      }
      return v;
    });

    let query = {
      volunteers: updatedVolunteers,
      [teamName]: team,
    };

    const updatedDoday = await Campaigns.findByIdAndUpdate(doday._id, query, {
      new: true,
    });

    return res.json({ success: true, updatedDoday });
  } catch (error) {
    console.log("error in addVolunteerToTeam: ", error);
    return res.json({ success: false, message: "internal server error" });
  }
};

//this function will take campaign id as param
//and will also take a volunteer object and team name as req.body
//then it will remove that volunteer from the team members list
//and update the volunteers list and set team name feild of that volunteer to null
exports.removeVolunteerFromTeam = async (req, res) => {
  try {
    let doday = await Campaigns.findById(req.params.id);
    if (!doday) {
      return res.json({ success: false, message: "do-day does not exist" });
    }
    const { teamName, volunteer } = req.body;
    let team = doday[teamName];
    let members = team.members;
    let volunteers = doday.volunteers;

    //check if the person being removed is the team leader
    //if he is then first make the leader to null then remove him

    if (team.leader === volunteer.number) {
      team.leader = null;
    }

    //updating members
    let updatedMembers = members.filter((m) => m.number !== volunteer.number);
    //updating volunteers list
    let updatedVolunteers = volunteers.map((v) => {
      if (v.number === volunteer.number) {
        return {
          ...v,
          team: null,
        };
      }
      return v;
    });
    team.members = updatedMembers;

    let query = {
      volunteers: updatedVolunteers,
      [teamName]: team,
    };

    const updatedDoday = await Campaigns.findByIdAndUpdate(doday._id, query, {
      new: true,
    });
    return res.json({ success: true, updatedDoday });
  } catch (error) {
    console.log("error in removeVolunteerFromTeam", error);
    return res.json({ success: true, message: "internal server error" });
  }
};
//this function will take campaign id as param
//and will also take a  team name and leader phone number as req.body
//it will add that phone number to the team leader
exports.makeTeamLead = async (req, res) => {
  try {
    let doday = await Campaigns.findById(req.params.id);
    if (!doday) {
      return res.json({ success: false, message: "do-day does not exist" });
    }
    const { teamName, leader } = req.body;
    let team = doday[teamName];

    team.leader = leader;

    const updatedDoday = await Campaigns.findByIdAndUpdate(
      doday._id,
      {
        [teamName]: team,
      },
      {
        new: true,
      }
    );
    //increasing the points
    if (req.body.status === "accepted") {
      await UserModel.findOneAndUpdate(
        { phoneNumber: leader },
        {
          $inc: { points: 100 },
        }
      );
    }
    return res.json({ success: true, updatedDoday });
  } catch (error) {
    console.log("error in makeTeamLead", error);
    return res.json({ success: true, message: "internal server error" });
  }
};
