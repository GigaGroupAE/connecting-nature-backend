const router = require("express").Router();
const verify = require("../middlewares/Auth");
const creategroup = require("../controllers/Groups/creategroup");
const getgroups = require("../controllers/Groups/getgroups");
const updategroup = require("../controllers/Groups/updategroup");
router.post("/creategroup", verify, creategroup);
router.get("/getgroups", verify, getgroups);
router.patch("/updategroup/:id", verify, updategroup);
module.exports = router;
