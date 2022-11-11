const router = require("express").Router();

const Users = require("../models/Register");

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
    return res.json({ success: true, message: error });
  }
});

module.exports = router;
