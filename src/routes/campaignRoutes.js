const router = require("express").Router();
const { createCampaign } = require("../controllers/campaigns/createCampaign");
const { getAllCampaigns } = require("../controllers/campaigns/getCampaign");
const verify = require("../middlewares/Auth");

router.post("/create", verify, createCampaign);
router.get("/get", verify, getAllCampaigns);

module.exports = router;
