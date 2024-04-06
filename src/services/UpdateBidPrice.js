const BidModel = require("../models/ApartmentsBids");

const updatePrice = async (data) => {
  try {
    const updatedItem = await BidModel.findByIdAndUpdate(
      data?.id,
      { bidPrice: data.newPrice },
      { new: true } // Return the updated item
    );
    const populatedItem = await updatedItem.populate({
      path: "bidOn",
      model: "bidApartment",
      select:
        "ProjectName PropertyType description bedrooms price unit biddingTime",
    });
    return populatedItem;
  } catch (error) {
    // Handle errors
    console.error("Error updating item price:", error);
    throw error;
  }
};

module.exports = updatePrice;
