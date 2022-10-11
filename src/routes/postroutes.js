const router = require("express").Router();
const addpost = require("../controllers/addPost");
const multer = require("multer");
const verify = require("../middlewares/Auth");
const storage = require("../middlewares/ImageUploader/ImageUploader");
const getposts = require("../controllers/GetPosts");
const updatepost = require("../controllers/updatePost");
const upload = multer({ storage: storage });

router.post("/addpost", verify, upload.single("media"), addpost);
router.get("/getposts", verify, getposts);
router.patch("/updateposts/:id", verify, updatepost);
module.exports = router;
