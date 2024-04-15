const router = require("express").Router()
const addpost = require("../controllers/posts/addPost")
const multer = require("multer")
const verify = require("../middlewares/Auth")
const storage = require("../middlewares/ImageUploader/ImageUploader")
const updatepost = require("../controllers/posts/updatePost")
const upload = require("../middlewares/ImageUploader/ImageUploader")
const { getPosts, postsExperiment ,searchPosts} = require("../controllers/posts/GetPosts")
const {
  getUserPosts,
  getUserTotalPostCount,
} = require("../controllers/posts/getMyPosts")
const getPost = require("../controllers/posts/getPost")
const DeleteComment = require("../controllers/posts/DeleteComment")
 const commentController=require("../controllers/posts/UpdateComments")
const { getPostsByCampaign } = require("../controllers/posts/GetPostByCampaign")

router.post("/addpost", verify, upload.single("media"), addpost)
router.get("/getposts", verify, getPosts)
router.get("/posts-pagination", verify, postsExperiment)
router.get("/search-post", verify, searchPosts)
router.patch("/delete-Comment", verify, DeleteComment)
router.get("/get-user-posts/:phoneNumber", verify, getUserPosts)
router.get("/getPostByCampaign/:id", verify, getPostsByCampaign)
router.get("/getPostCount/:phoneNumber", getUserTotalPostCount)
router.patch("/update-Comment/:id", verify,  commentController.handleCommentAction)


router.patch("/updateposts/:id", verify, updatepost)

router.post("/getPost", verify, getPost)
module.exports = router
