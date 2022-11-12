const router = require("express").Router();
const verify = require("../middlewares/Auth");
const creategroup = require("../controllers/Groups/creategroup");
const getgroups = require("../controllers/Groups/getgroups");
const updategroup = require("../controllers/Groups/updategroup");
const upload = require("../middlewares/ImageUploader/ImageUploader");

router.post("/creategroup", verify, upload.single("groupPic"), creategroup);
router.get("/getgroups", verify, getgroups);
router.patch("/updategroup/:id", verify, updategroup);
module.exports = router;
