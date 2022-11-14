const router = require("express").Router();
const SMsApi = require("../controllers/invite/SmsApi");
const verify = require("../middlewares/Auth");
router.post("/inviteSMS", verify, SMsApi);
module.exports = router;
