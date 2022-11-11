const router = require("express").Router();

const Users = require("../models/Register");
const Posts = require("../models/post");

//get users
router.get("/getallusers", async (req, res) => {
  console.log("get all usres called");
  try {
    const users = await Users.find();

    return res.send({ success: true, users });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
});

//delete user

router.delete("/deleteuser/:id", async (req, res) => {
  try {
    //find user to be deleted
    let userToBeDeleted = await Users.findById(req.params.id);

    if (!userToBeDeleted) {
      return res.status(500).json({
        success: false,
        message: "User does not exist",
      });
    }
    //deleting the user

    await Users.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "user deleted sucessfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
});

//get posts
router.get("/getallposts", async (req, res) => {
  try {
    let posts = await Posts.find();
    return res.json({ success: true, posts });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
});

//delete post

router.delete("/deletepost/:id", async (req, res) => {
  try {
    //find user to be deleted
    let postToBeDeleted = await Posts.findById(req.params.id);

    if (!postToBeDeleted) {
      return res.status(500).json({
        success: false,
        message: "Post does not exist",
      });
    }
    //deleting the user

    await Posts.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Post deleted sucessfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
});

module.exports = router;
