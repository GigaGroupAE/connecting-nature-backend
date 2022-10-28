const router = require("express").Router();
const verify = require("../middlewares/Auth");
const addnotification = require("../controllers/notification/addnotification");
const getnoties = require("../controllers//notification/getnotifications");
router.post("/addnotification", verify, addnotification);
router.get("/getnoties", verify, getnoties);
module.exports = router;
