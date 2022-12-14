const router = require("express").Router();
const addstory = require("../controllers/stories/addstory");
const verify = require("../middlewares/Auth");
const getstories = require("../controllers/stories/getstories");
const updatestory = require("../controllers/stories/updatestory");
const upload = require("../middlewares/ImageUploader/ImageUploader");

router.post("/addstory", verify, upload.single("media"), addstory);
router.get("/getstories", verify, getstories);
router.patch("/updatestory/:id", verify, updatestory);
module.exports = router;
