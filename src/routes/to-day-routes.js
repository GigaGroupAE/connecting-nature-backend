const router = require("express").Router();
const createtoday = require("../controllers/do-day/create-to-day");
const getodays = require("../controllers/do-day/gettodays");
const { LockUnlockDoday } = require("../controllers/do-day/unlockDoDay");
const updatedoday = require("../controllers/do-day/updatedoDay");
const { updateVolunteers } = require("../controllers/do-day/updateVolunteer");
const verify = require("../middlewares/Auth");
router.post("/createtoday", verify, createtoday);
router.get("/getoday", verify, getodays);
router.patch("/updatedoday/:id", updatedoday);
router.put("/unlockDoDay/:id", verify, LockUnlockDoday);
router.put("/update-volunteer/:id", verify, updateVolunteers); //id of the doday
module.exports = router;
