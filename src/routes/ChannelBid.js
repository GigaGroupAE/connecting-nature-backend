const router = require("express").Router();
const {
  createChannel,
  getChannel,
  createBidApartment,
  getAllBidApartments,
  updateProjectStatus,
  getArchiveApartments,
  winnerAnnouncement,
  updateGroupMembers,
  removeSubscriber,
} = require("../controllers/BIdChannel/CreateChaneel");
const verify = require("../middlewares/Auth");
const uploadmedia = require("../middlewares/MessageMediaUploader/MessageMediaUploader");
const upload = require("../middlewares/ImageUploader/ImageUploader");
const {
  createRequest,
  checkSubscriptionStatus,
  getAllRequests,
  approveSubscription,
  rejectSubscription,
} = require("../controllers/ChannelSubscription");

router.post("/createchannel", verify, upload.single("groupPic"), createChannel);
router.get("/get-channel", verify, getChannel);
router.post(
  "/create-project",
  verify,
  upload.array("image", 5),
  createBidApartment
);
router.get("/get-projects", verify, getAllBidApartments);
router.patch("/update-status/:id", verify, updateProjectStatus);
router.post("/create-subreq", verify, upload.single("image"), createRequest);
router.get("/check-substatus", verify, checkSubscriptionStatus);
router.get("/get-archiveProjects", verify, getArchiveApartments);
router.patch("/winner-announce/:id", verify, winnerAnnouncement);
router.patch("/add-member/:id", verify, updateGroupMembers);
router.patch("/remove-member-chanel/:id", verify, removeSubscriber);
router.get("/get-subscription-req", verify, getAllRequests);
router.post("/approve-subscription", verify, approveSubscription);
router.post("/reject-subscription", verify, rejectSubscription);

module.exports = router;
