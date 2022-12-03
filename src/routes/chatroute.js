const router = require("express").Router();
const verify = require("../middlewares/Auth");

const createchat = require("../controllers/chats/createchat");
const getchats = require("../controllers/chats/getchats");
const updatechat = require("../controllers/chats/updatechats");
const updatemessages = require("../controllers/chats/updateMessages");
const uploadmedia = require("../middlewares/MessageMediaUploader/MessageMediaUploader");
router.post("/createchat", verify, createchat);
router.get("/getchats", verify, getchats);
router.patch("/updatachat/:id", verify, updatechat);
router.post("/saveMedia", uploadmedia.single("media"), updatemessages);
module.exports = router;
