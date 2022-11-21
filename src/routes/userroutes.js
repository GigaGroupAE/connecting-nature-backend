const router = require("express").Router();
const login = require("../controllers/user/Login");
const getusers = require("../controllers/user/getusers");
const signup = require("../controllers/user/signup");
const verify = require("../middlewares/Auth");
const OTPGen = require("../controllers/user/OTPGen");
const upload = require("../middlewares/ImageUploader/ImageUploader");

router.post("/login", login);
router.post("/register", upload.single("profile"), signup);
router.get("/getusers", verify, getusers);
router.post("/otp", OTPGen);

module.exports = router;
