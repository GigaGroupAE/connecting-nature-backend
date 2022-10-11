const router = require("express").Router();
const createtoday = require("../controllers/create-to-day");
const getodays = require("../controllers/gettodays");
const updatedoday = require("../controllers/updatedoDay");
const verify = require("../middlewares/Auth");
router.post("/createtoday", verify, createtoday);
router.get("/getoday", verify, getodays);
router.patch("/updatedoday/:id", updatedoday);
module.exports = router;
