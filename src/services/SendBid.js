const BidModel = require("../models/ApartmentsBids");
const BidApartmentModel = require("../models/bidApartments");

const sendBidMessage = async (data) => {
  try {
    let bidApartment = await BidApartmentModel.findById(data.bidOn);

    if (!bidApartment) {
      console.log("Bid apartment not found");
      return;
    }

    const newBidMessage = await BidModel.create({
      ...data,
    });
    bidApartment.bids.push(newBidMessage._id);

    await bidApartment.save();

    bidApartment = await BidApartmentModel.findById(data.bidOn).populate({
      path: "bids",
      populate: {
        path: "bidOn",
        model: "bidApartment",
        select:
          "ProjectName PropertyType description bedrooms price unit biddingTime",
      },
      select: "bidBy bidOn bidPrice bidTime",
    });

    // Return the updated bid apartment
    return bidApartment;
  } catch (error) {
    // Handle errors
    console.error("Error sending bid message:", error);
    throw error;
  }
};

module.exports = sendBidMessage;
