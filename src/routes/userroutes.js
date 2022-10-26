const router = require("express").Router();
const login = require("../controllers/Login");
const getusers = require("../controllers/getusers");
const signup = require("../controllers/signup");
const storage = require("../middlewares/ImageUploader/ImageUploader");
const multer = require("multer");
const verify = require("../middlewares/Auth");
const OTPGen = require("../controllers/OTPGen");
const upload = multer({ storage: storage });

router.post("/login", login);
router.post("/register", upload.single("profile"), signup);
router.get("/getusers", verify, getusers);
router.get("/otp", OTPGen);
module.exports = router;
