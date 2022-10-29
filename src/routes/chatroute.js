const router = require("express").Router();
const verify = require("../middlewares/Auth");

const createchat = require("../controllers/chats/createchat");
const getchats = require("../controllers/chats/getchats");
const updatechat = require("../controllers/chats/updatechats");

router.post("/createchat", verify, createchat);
router.get("/getchats", verify, getchats);
router.patch("/updatachat/:id", verify, updatechat);
module.exports = router;
