const router = require("express").Router();
const addpost = require("../controllers/posts/addPost");
const multer = require("multer");
const verify = require("../middlewares/Auth");
const storage = require("../middlewares/ImageUploader/ImageUploader");
const getposts = require("../controllers/posts/GetPosts");
const updatepost = require("../controllers/posts/updatePost");
const upload = require("../middlewares/ImageUploader/ImageUploader");

router.post("/addpost", verify, upload.single("media"), addpost);
router.get("/getposts", verify, getposts);
router.patch("/updateposts/:id", verify, updatepost);
module.exports = router;
