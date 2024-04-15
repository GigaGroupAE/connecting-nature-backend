const mongoose = require("mongoose");
const BidApartmentModel = require("../models/bidApartments");

exports.handleAnnouncement = async (data) => {
  try {
    let bidApartment = await BidApartmentModel.findById(data.bidOn);

    if (!bidApartment) {
      console.log("Bid apartment not found");
      return;
    }

    const updatedAnnouncement = await BidApartmentModel.findByIdAndUpdate(
      data.bidOn,
      {
        $push: {
          announcement: {
            announcementItem: {
              content: data.announcement,
              createdAt: new Date(),
            },
          },
        },
      },
      { new: true }
    );

    return updatedAnnouncement;
  } catch (error) {
    console.error("Error:", error);
  }
};
