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
  fetchClosedBidApartments,
  getapprtmentdBidReport,
  getUnderReviewApartments,
  updateBidApartment,
  makeLead,
  handleApprove,
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
const {
  addcrmNotifications,
  getAllNotificationsForUser,
  notifynewBid,
} = require("../controllers/BiddingNotifications/BiddingNotifications");
const {
  createSection,
  getAuctions,
} = require("../controllers/AuctionSections/AuctionSections");

router.post("/createchannel", verify, upload.single("groupPic"), createChannel);
router.get("/get-channel", verify, getChannel);
router.post(
  "/create-project",
  verify,
  upload.array("image", 5),
  createBidApartment
);

router.patch(
  "/update-project/:id",
  upload.array("image", 5),
  verify,
  updateBidApartment
);
router.get("/get-projects", verify, getAllBidApartments);
router.patch("/update-status/:id", verify, updateProjectStatus);
router.get("/get-archiveProjects", verify, getArchiveApartments);
router.get("/get-under-review", verify, getUnderReviewApartments);
router.patch("/winner-announce/:id", verify, winnerAnnouncement);
router.get("/download-report/:id", verify, getapprtmentdBidReport);
router.patch("/add-member/:id", verify, updateGroupMembers);
router.get("/closed-bid-apartments", verify, fetchClosedBidApartments);
router.post("/approve-property", verify, handleApprove);

// Routes for managing subscription
router.get("/get-subscription-req", verify, getAllRequests);
router.post("/approve-subscription", verify, approveSubscription);
router.post("/reject-subscription", verify, rejectSubscription);
router.post("/create-subreq", verify, upload.single("image"), createRequest);
router.get("/check-substatus", verify, checkSubscriptionStatus);
router.patch("/remove-member-chanel/:id", verify, removeSubscriber);
router.patch("/make-lead/:id", verify, makeLead);

// Routes for managing notifications
router.post("/add-crm-notification", verify, addcrmNotifications);
router.get("/get-crm-notifications", verify, getAllNotificationsForUser);
router.post("/notify-new-bid", verify, notifynewBid);
// Routes for managing Auction Sections

router.post("/create-section", verify, createSection);
router.get("/get-auctions", verify, getAuctions);
module.exports = router;
