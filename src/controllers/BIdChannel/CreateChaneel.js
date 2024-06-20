const Channel = require("../../models/BidChannel");
const auctionSections = require("../../models/AuctionSection");

const bidAppartmint = require("../../models/bidApartments");
const mongoose = require("mongoose");
const subscriptionModal = require("../../models/ChannelSubscription");
const { ObjectId } = require("mongoose").Types;

const User = require("../../models/Register");

exports.createChannel = async (req, res) => {
  let path = "";
  if (req.file === undefined) {
    path = "no-profile-picture-placeholder.png";
  } else {
    path = req.file.filename;
  }

  const newgroup = new Channel({
    appartments: [],
    title: req.body.title,
    members: JSON.parse(req.body.members),
    groupPic: path,
  });
  if (!newgroup) {
    res.send({ message: "Invalid data body", status: 400 });
  }
  try {
    const savedgroup = await newgroup.save();
    res.status(200).send(savedgroup);
  } catch (err) {
    res.send({ message: err, status: 400 });
  }
};

exports.getChannel = async (req, res) => {
  try {
    const allChannels = await Channel.find().populate({
      path: "members.member",
      select: "fullName phoneNumber profile type expoPushToken",
    });

    return res.status(200).send(allChannels);
  } catch (error) {
    // Handle errors
    console.error("Error fetching groups:", error.message);
    return res.status(500).send("Server error");
  }
};

exports.createBidApartment = async (req, res) => {
  let image = req.files.map((file) => {
    return {
      filename: file.filename,
      mimetype: file.mimetype,
    };
  });
  let bids = [];

  const data = {
    ...req.body,
    image,
    bids,
  };

  try {
    const newBidApartment = await bidAppartmint.create(data);
    const isAlreduRunning = await bidAppartmint.find({
      status: "Started",
    });
    if (req.body.status === "Starting Soon" && isAlreduRunning.length !== 0) {
      const updateNewProjectStatus = await bidAppartmint.findByIdAndUpdate(
        newBidApartment?._id,
        { status: "Started" },
        { new: true }
      );

      const lastAuctionSection = await auctionSections
        .findOne()
        .sort({ _id: -1 });

      if (lastAuctionSection) {
        lastAuctionSection.projectItems.push(newBidApartment._id);
        await lastAuctionSection.save();
      }
    }

    res.status(201).json({
      status: "Success",
      message: "Property created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateBidApartment = async (req, res) => {
  const { id } = req.params;

  // Handle image files if there are any
  let image = [];
  if (req.files?.length !== 0) {
    image = req.files.map((file) => {
      return {
        filename: file.filename,
        mimetype: file.mimetype,
      };
    });
  }

  // Prepare the updated data
  let updatedData = { ...req.body };

  // Conditionally add image to updatedData
  if (image.length > 0) {
    updatedData.image = image;
  }

  try {
    // Find the existing bid apartment by ID
    let bidApartment = await bidAppartmint.findById(id);

    if (!bidApartment) {
      return res.status(404).json({
        status: "Error",
        message: "Bid apartment not found",
      });
    }

    // Update the bid apartment with the new data
    bidApartment = await bidAppartmint.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({
      status: "Success",
      message: "Bid apartment updated successfully",
      data: bidApartment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBidApartments = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    if (isNaN(perPage) || isNaN(page) || perPage <= 0 || page <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid perPage or page parameters" });
    }

    const totalCount = await bidAppartmint.countDocuments({
      status: { $nin: ["Archive", "Under Review", "rejected"] },
    });

    // Fetch paginated bid apartments
    const bidApartments = await bidAppartmint
      .find({ status: { $nin: ["Archive", "Under Review", "rejected"] } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "bids",
        populate: {
          path: "bidOn",
          model: "bidApartment",
          select:
            " ProjectName   PropertyType    description  bedrooms  price    unit    biddingTime",
        },
        select: "bidBy bidOn bidPrice bidTime",
      });

    // Send response with paginated bid apartments
    res.status(200).json({
      status: "Success",
      totalCount,
      page,
      perPage,
      data: bidApartments,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching bid apartments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateProjectStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const updateFields = req.body;

    if (!id || !updateFields) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    const updatedProject = await bidAppartmint.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    // Handle errors
    console.error("Error updating project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.handleApprove = async (req, res) => {
  try {
    const { id, status } = req.body;
    const isAlreadyAuctionActive = await bidAppartmint.find({
      status: "Started",
    });

    console.log(isAlreadyAuctionActive, "status");

    if (isAlreadyAuctionActive?.length > 0) {
      const updateNewProjectStatus = await bidAppartmint.findByIdAndUpdate(
        id,
        { status: "Started" },
        { new: true }
      );

      const lastAuctionSection = await auctionSections
        .findOne()
        .sort({ _id: -1 });

      if (lastAuctionSection) {
        lastAuctionSection.projectItems.push(id);
        await lastAuctionSection.save();
      }
      res.status(201).json({
        status: "Success",
        message: "Property created successfully",
      });
    } else {
      await bidAppartmint.findByIdAndUpdate(
        id,
        { status: "Starting Soon" },
        { new: true }
      );
      res.status(201).json({
        status: "Success",
        message: "Property created successfully",
      });
    }
  } catch (error) {
    logger.error("Error handling approval:", error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while processing your request",
    });
  }
};

exports.getArchiveApartments = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    if (isNaN(perPage) || isNaN(page) || perPage <= 0 || page <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid perPage or page parameters" });
    }

    const totalCount = await bidAppartmint.countDocuments({
      status: "Archive", // Filter by status "Archive"
    });

    const bidApartments = await bidAppartmint
      .find({ status: "Archive" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "bids",
        populate: {
          path: "bidOn",
          model: "bidApartment",
          select:
            "ProjectName PropertyType description bedrooms price unit biddingTime",
        },
        select: "bidBy bidOn bidPrice bidTime",
      })
      .populate({
        path: "winner",
        select: "bidBy bidOn bidPrice bidTime",
      });

    // Send response with paginated bid apartments
    res.status(200).json({
      status: "Success",
      totalCount,
      page,
      perPage,
      data: bidApartments,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching bid apartments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.winnerAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;

    const { status, winner } = req.body;

    if (!id || !status || !winner) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    const updatedProject = await bidAppartmint.findByIdAndUpdate(
      id,
      { status: status, winner: winner }, // Corrected update object
      { new: true } // Return the updated item
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      message: "Project status updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    // Handle errors
    console.error("Error updating project status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateGroupMembers = async (req, res) => {
  const { id } = req.params;
  const { members } = req.body;

  try {
    // Validate group ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Validate members array
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Invalid members data" });
    }

    // Update group members
    const updatedGroup = await Channel.findByIdAndUpdate(
      id,
      { members: members },
      { new: true }
    ).populate({
      path: "members.member",
      select: "fullName phoneNumber profile type expoPushToken",
    });

    // Check if group exists
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Return updated group
    return res.status(200).json(updatedGroup);
  } catch (error) {
    // Handle errors
    console.error("Error updating group members:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const user = req.user._id;

    // Validate group ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Validate member ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid member ID" });
    }

    // Remove subscriber from the group
    const updatedGroup = await Channel.findByIdAndUpdate(
      id,
      { $pull: { members: { member: userId } } },
      { new: true }
    ).populate({
      path: "members.member",
      select: "fullName phoneNumber profile type expoPushToke",
    });

    const updatedSubscription = await subscriptionModal.findOneAndUpdate(
      {
        requestedBy: userId,
      }, // Find subscriptions where memberId is in requestedBy
      {
        $set: {
          status: "remove",
          removedBy: user, // Set the status to 'remove' and set the removedBy field
        },
      },
      { new: true } // Options object containing 'new' to return the updated document
    );

    // Check if group exists
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Return updated group with populated members
    return res.status(200).json({
      message: "Subscriber removed successfully",
      group: updatedGroup,
    });
  } catch (error) {
    // Handle errors
    console.error("Error removing subscriber:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.UnsubscribeChannel = async (req, res) => {
  try {
  } catch (error) {}
};

exports.makeLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid group ID or user ID" });
    }
    const updatedGroup = await Channel.findByIdAndUpdate(
      id,
      {
        $set: {
          "members.$[elem].privilege": "Lead",
        },
      },
      {
        arrayFilters: [
          {
            "elem.member": ObjectId(userId),
          },
        ],
        new: true,
      }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.fetchClosedBidApartments = async (req, res) => {
  try {
    // Fetch bidApartments with status "Closed" and sort by createdAt
    const closedBidApartments = await bidAppartmint
      .find({ status: "Closed" })
      .sort({ createdAt: -1 })
      .populate({
        path: "bids",
        populate: {
          path: "bidOn",
          model: "bidApartment",
          select:
            " ProjectName   PropertyType    description  bedrooms  price    unit    biddingTime",
        },
        select: "bidBy bidOn bidPrice bidTime",
      });

    // If no closed bidApartments found, return an empty array
    if (closedBidApartments.length === 0) {
      return res.status(200).json([]);
    }

    // Return the fetched bidApartments to the client
    return res.status(200).json(closedBidApartments);
  } catch (error) {
    // Handle errors
    console.error("Error fetching closed bidApartments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getapprtmentdBidReport = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await bidAppartmint.findById(id).populate({
      path: "bids",
      populate: {
        path: "bidOn",
        model: "bidApartment",
        select:
          "ProjectName PropertyType  description bedrooms price  unit biddingTime",
      },
      select: "bidBy bidOn bidPrice bidTime",
    });
  } catch (error) {}
};

exports.getUnderReviewApartments = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    if (isNaN(perPage) || isNaN(page) || perPage <= 0 || page <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid perPage or page parameters" });
    }

    const totalCount = await bidAppartmint.countDocuments({
      status: "Archive", // Filter by status "Archive"
    });

    const bidApartments = await bidAppartmint
      .find({ status: "Under Review" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "bids",
        populate: {
          path: "bidOn",
          model: "bidApartment",
          select:
            "ProjectName PropertyType description bedrooms price unit biddingTime",
        },
        select: "bidBy bidOn bidPrice bidTime",
      })
      .populate({
        path: "winner",
        select: "bidBy bidOn bidPrice bidTime",
      })
      .populate({
        path: "from",
        select: "fullName phoneNumber profile type expoPushToken",
      });

    // Send response with paginated bid apartments
    res.status(200).json({
      status: "Success",
      totalCount,
      page,
      perPage,
      data: bidApartments,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching bid apartments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateGroupPic = async (req, res) => {
  const { id } = req.params;
  const { groupPic } = req.body;

  try {
    const updatedChannel = await Channel.findByIdAndUpdate(
      id,
      { $set: { groupPic } },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res
      .status(200)
      .json({ message: "Group picture updated successfully", updatedChannel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserType = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const userType = user.type;
    res.status(200).send(userType);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
