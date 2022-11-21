const router = require("express").Router();
const verify = require("../middlewares/Auth");
const creategroup = require("../controllers/Groups/creategroup");
const getgroups = require("../controllers/Groups/getgroups");
const updategroup = require("../controllers/Groups/updategroup");
const getgroupbyid = require("../controllers/Groups/getgroupbyid");
const updatemessages = require("../controllers/Groups/updateMessages");
const upload = require("../middlewares/ImageUploader/ImageUploader");

router.post("/creategroup", verify, upload.single("groupPic"), creategroup);
router.get("/getgroups", verify, getgroups);
router.patch("/updategroup/:id", verify, updategroup);
router.get("/getgroupbyid/:id", verify, getgroupbyid);
router.patch("/saveMedia", upload.single("media"), updatemessages);
module.exports = router;
