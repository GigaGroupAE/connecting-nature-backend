const router = require("express").Router();
const {
  addVolunteerToTeam,
  removeVolunteerFromTeam,
  makeTeamLead,
} = require("../controllers/do-day/teams");
const createtoday = require("../controllers/do-day/create-to-day");
const getodays = require("../controllers/do-day/gettodays");
const { LockUnlockDoday } = require("../controllers/do-day/unlockDoDay");
const updatedoday = require("../controllers/do-day/updatedoDay");
const {
  updateMultipleVolunteers,
} = require("../controllers/do-day/updateMultipleVolunteers");
const { updateVolunteers } = require("../controllers/do-day/updateVolunteer");
const verify = require("../middlewares/Auth");
const { getBYId } = require("../controllers/do-day/getById");
router.post("/createtoday", verify, createtoday);
router.get("/getoday", verify, getodays);
router.get("/getById/:id",verify,getBYId)
router.patch("/updatedoday/:id", updatedoday);
router.put("/unlockDoDay/:id", verify, LockUnlockDoday);
router.put("/update-volunteer/:id", verify, updateVolunteers); //id of the doday
router.put("/update-multiple-volunteers/:id", verify, updateMultipleVolunteers);
router.patch("/add-volunteer-to-team/:id", verify, addVolunteerToTeam);
router.patch("/make-team-lead/:id", verify, makeTeamLead);
router.patch(
  "/remove-volunteer-from-team/:id",
  verify,
  removeVolunteerFromTeam
);
module.exports = router;
