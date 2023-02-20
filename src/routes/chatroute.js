const router = require("express").Router();
const verify = require("../middlewares/Auth");

const createchat = require("../controllers/chats/createchat");
const updatechat = require("../controllers/chats/updatechats");
const updatemessages = require("../controllers/chats/updateMessages");
const uploadmedia = require("../middlewares/MessageMediaUploader/MessageMediaUploader");
const { getMyChats, getchats } = require("../controllers/chats/getchats");
router.post("/createchat", verify, createchat);
router.get("/getchats", verify, getchats);
router.patch("/updatachat/:id", verify, updatechat);
router.post("/saveMedia", uploadmedia.single("media"), updatemessages);

router.get("/get-my-chats" , verify,getMyChats)
module.exports = router;
