const router = require("express").Router();
const login = require("../controllers/user/Login");
const getusers = require("../controllers/user/getusers");
const signup = require("../controllers/user/signup");
const verify = require("../middlewares/Auth");
const OTPGen = require("../controllers/user/OTPGen");
const upload = require("../middlewares/ImageUploader/ImageUploader");
const updateuser = require("../controllers/user/updateuser");
const {
  updateExpoPushToken,
} = require("../controllers/user/updateExpoPushToken");

router.post("/login", login);
router.post("/register", upload.single("profile"), signup);
router.get("/getusers", verify, getusers);
router.post("/otp", OTPGen);
router.put("/updateUserExpoToken", verify, updateExpoPushToken);
router.patch("/updateUser/:id", verify, updateuser);
module.exports = router;
