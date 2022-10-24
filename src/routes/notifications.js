const router = require("express").Router();
const verify = require("../middlewares/Auth");
const addnotification = require("../controllers/addnotification");
const getnoties = require("../controllers/getnotifications");
router.post("/addnotification", addnotification);
router.get("/getnoties", getnoties);
module.exports = router;
