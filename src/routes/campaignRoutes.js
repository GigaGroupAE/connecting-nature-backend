const router = require("express").Router();
const { createCampaign } = require("../controllers/campaigns/createCampaign");
const { getAllCampaigns } = require("../controllers/campaigns/getCampaign");
const { inviteVolunteer } = require("../controllers/campaigns/inviteVolunteer");
const { invitesResponse } = require("../controllers/campaigns/invitesResponse");
const { makeLead } = require("../controllers/campaigns/makeLead");
const { addVolunteerToTeam, removeVolunteerFromTeam } = require("../controllers/campaigns/teams");
const verify = require("../middlewares/Auth");

router.post("/create", verify, createCampaign);
router.get("/get", verify, getAllCampaigns);
router.patch("/invite-volunteer/:campaignId", verify, inviteVolunteer);
router.patch("/invite-response/:campaignId", verify, invitesResponse);
router.patch("/add-volunteer/:campaignId", verify, addVolunteerToTeam);
router.patch("/remove-volunteer/:campaignId", verify, removeVolunteerFromTeam);


router.patch("/make-lead/:campaignId", verify, makeLead);

module.exports = router;
