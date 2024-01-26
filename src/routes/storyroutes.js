const router = require("express").Router();
const addstory = require("../controllers/stories/addstory");
const verify = require("../middlewares/Auth");
const getstories = require("../controllers/stories/getstories");
const updatestory = require("../controllers/stories/updatestory");
const upload = require("../middlewares/ImageUploader/ImageUploader");
const getstory = require("../controllers/stories/getstory");
 const commentController = require("../controllers/stories/UpdateStoryComment");
 const DeleteComment = require("../controllers/stories/DeleteComment");

router.post("/addstory", verify, upload.single("media"), addstory);
router.get("/getstories", verify, getstories);
router.patch("/updatestory/:id", verify, updatestory);
router.post("/getstory", verify, getstory);
router.patch(
  "/update-story-Comment/:id",
  verify,
  commentController.handleCommentAction
);
router.patch("/delete-story-comment", verify, DeleteComment);
module.exports = router;
