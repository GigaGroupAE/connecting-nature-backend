const router = require("express").Router();
const verify = require("../middlewares/Auth");
const addnotification = require("../controllers/notification/addnotification");
const getnoties = require("../controllers//notification/getnotifications");
const {
  notifyPostAuthor,
} = require("../controllers/notification/notifyPostAuthor");
router.post("/addnotification", verify, addnotification);
router.get("/getnoties", verify, getnoties);

router.post("/commentNotification/:id", verify, notifyPostAuthor);
module.exports = router;
