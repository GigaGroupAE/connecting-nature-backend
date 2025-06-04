const subscriptionModal = require("../models/ChannelSubscription");

const bidChannel = require("../models/BidChannel");
const User = require("../models/Register");

exports.createRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phoneNumber } = req.body;
    const image = req.file.filename;

    // Check if there is an existing subscription request for the user
    const existingSubscription = await subscriptionModal.findOne({
      requestedBy: userId,
      status: { $in: ["Pending", "approve"] }, // Check for "Pending" or "approve" status
    });

    if (existingSubscription) {
      // If there is an existing subscription request
      if (existingSubscription.status === "Pending") {
        return res
          .status(400)
          .json({ message: "Subscription request already pending." });
      } else if (existingSubscription.status === "approve") {
        return res
          .status(400)
          .json({ message: "Subscription request already approved." });
      }
    }

    // If there is no existing subscription request or the existing one is rejected
    const newSubscription = await subscriptionModal.create({
      requestedBy: userId,
      fullName,
      phoneNumber,
      image,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Subscription request created successfully.",
    });
  } catch (error) {
    console.error("Error creating subscription request:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.checkSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const existingSubscription = await subscriptionModal.findOne({
      requestedBy: userId,
      status: { $in: ["Pending", "approve"] },
    });

    if (existingSubscription) {
      if (existingSubscription.status === "Pending") {
        return res.status(200).json({ message: "Pending" });
      } else if (existingSubscription.status === "approve") {
        return res.status(200).json({ message: "approve" });
      }
    }
    return res.status(200).json({
      message: "NotExists.",
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    // Fetch all subscription requests
    const subscriptionRequests = await subscriptionModal.find().populate({
      path: "requestedBy",
      select: "fullName phoneNumber profile type expoPushToken",
    });
    return res.status(200).json({
      message: "Subscription requests fetched successfully.",
      requests: subscriptionRequests,
    });
  } catch (error) {
    console.error("Error fetching subscription requests:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.approveSubscription = async (req, res) => {
  const { member, privilege, code, item } = req.body?.data;

  try {
    // Find the subscription with the specified item
    const subscription = await subscriptionModal.findOneAndUpdate(
      { _id: item },
      { status: "approve" },
      { new: true }
    );

    if (subscription) {
      const updateRole = await User.findOneAndUpdate(
        { _id: member, type: "user" },
        { type: "subscriber" },
        { new: true }
      );

      // Now update the channel's first item with the provided data
      const updatedChannel = await bidChannel.findOneAndUpdate(
        {}, // Empty condition to match any channel
        { $push: { members: { member, privilege, code } } }, // Push the new data to the 'members' array
        { new: true } // To return the updated document
      );

      // Send a response indicating success
      return res.status(200).json({
        message: "Subscription approved successfully",
        subscription,
        updatedChannel,
      });
    } else {
      // If no subscription found with the specified item
      console.log("No subscription found with item:", item);
      return res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error approving subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.rejectSubscription = async (req, res) => {
  console.log(req.body.rejectReason);
  try {
    const { id, denyingReason, status } = req.body.rejectReason || {};

    const subscription = await subscriptionModal.findOneAndUpdate(
      { id },
      { status, denyingReason },
      { new: true }
    );

    if (subscription) {
      return res
        .status(200)
        .json({ message: "Subscription rejected successfully", subscription });
    } else {
      // If no subscription found with the specified ID
      console.log("No subscription found with ID:", id);
      return res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error rejecting subscription:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
