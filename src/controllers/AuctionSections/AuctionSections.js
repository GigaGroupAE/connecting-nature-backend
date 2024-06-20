const auctionSections = require("../../models/AuctionSection");
const Channel = require("../../models/BidChannel");
const bidAppartment = require("../../models/bidApartments");
const { Expo } = require("expo-server-sdk");

const sendNotification = async (recipient, token, title, message) => {
  try {
    const expo = new Expo({
      useFcmV1: true,
    });
    const messageData = {
      to: token,
      sound: "default",
      title: `${title} - ${message}`,
      body: message,
    };
    const tickets = await expo.sendPushNotificationsAsync([messageData]);
  } catch (error) {
    console.log(error);
  }
};

exports.createSection = async (req, res) => {
  const status = req.body.status;

  try {
    if (status === "Started") {
      // Find all items with status "Starting Soon"
      const items = await bidAppartment.find({ status: "Starting Soon" });
      const ids = items.map((item) => item?._id);

      // Update all items with status "Starting Soon" to "Started"
      await bidAppartment.updateMany(
        { status: "Starting Soon" },
        { $set: { status: "Started" } }
      );
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = String(currentDate.getFullYear()).slice(-2);
      const projectName = `auction${day}-${month}-${year}`;
      await auctionSections.create({
        projectName: projectName,
        projectItems: ids,
      });
    } else if (status === "Closed") {
      // Find all items with status "Started"
      const items = await bidAppartment.find({ status: "Started" }).populate({
        path: "bids",
        populate: {
          path: "bidOn",
          model: "bidApartment",
          select:
            "ProjectName PropertyType description bedrooms price unit biddingTime",
        },
      });
      console.log(items);

      for (const item of items) {
        const sortedBids = item.bids?.sort(
          (a, b) => parseInt(b.bidPrice) - parseInt(a.bidPrice)
        );
        const winnerBid = sortedBids && sortedBids[0] ? sortedBids[0] : null;
        console.log(winnerBid, "winner");
        if (winnerBid) {
          await bidAppartment.updateOne(
            { _id: item._id },
            { $set: { status: "Archive", winner: winnerBid._id } }
          );

          // Get winner details
          const winner = winnerBid.bidBy[0]; // Assuming `bidBy` is an array and you want the first entry

          // Prepare notification details
          const projectName = item.ProjectName;
          const notificationTitle = "Congratulations! You've Won the Auction!";
          const notificationMessage = `You have won the project "${projectName}" with your bid of ${winnerBid.bidPrice}.`;

          // Send notification to the winner
          await sendNotification(
            winner.fullName,
            winner.expoPushToken,
            notificationTitle,
            notificationMessage
          );
        } else {
          await bidAppartment.updateOne(
            { _id: item._id },
            { $set: { status: "Archive" } }
          );
        }
      }
    }
    res.status(200).send("Status updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating status");
  }
};
exports.getAuctions = async (req, res) => {
  try {
    // Extract page and limit from query parameters, set defaults if not provided

    const limit = parseInt(req.query.limit) || 10;
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the paginated results
    const items = await auctionSections
      .find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "projectItems",
        select: "channel ProjectName",
        populate: [
          {
            path: "bids",
            populate: {
              path: "bidOn",
              model: "bidApartment",
              select:
                "ProjectName PropertyType description bedrooms price unit biddingTime",
            },
            select: "bidBy bidOn bidPrice bidTime",
          },
          {
            path: "winner",
            model: "bids",
            select: "bidBy bidOn bidPrice bidTime",
          },
        ],
      });

    // Fetch the total number of documents for pagination metadata
    const totalCount = await auctionSections.countDocuments({});

    // Send the paginated results and pagination metadata
    res.status(200).json({
      status: "Success",
      totalCount,
      page,
      perPage,
      data: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching auctions");
  }
};
