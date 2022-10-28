const router = require("express").Router();
const login = require("../controllers/user/Login");
const getusers = require("../controllers/user/getusers");
const signup = require("../controllers/user/signup");
const storage = require("../middlewares/ImageUploader/ImageUploader");
const multer = require("multer");
const verify = require("../middlewares/Auth");
const OTPGen = require("../controllers/user/OTPGen");
const upload = multer({ storage: storage });

router.post("/login", login);
router.post("/register", upload.single("profile"), signup);
router.get("/getusers", verify, getusers);
router.get("/otp", OTPGen);
module.exports = router;
