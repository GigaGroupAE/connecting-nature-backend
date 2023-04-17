const router = require("express").Router();
const { createCampaign } = require("../controllers/campaigns/createCampaign");
const { getAllCampaigns } = require("../controllers/campaigns/getCampaign");
const { inviteVolunteer } = require("../controllers/campaigns/inviteVolunteer");
const verify = require("../middlewares/Auth");

router.post("/create", verify, createCampaign);
router.get("/get", verify, getAllCampaigns);
router.patch("/invite-volunteer/:campaignId", verify, inviteVolunteer);

module.exports = router;
