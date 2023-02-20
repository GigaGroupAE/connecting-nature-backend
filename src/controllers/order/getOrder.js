const OrderModel = require("../../models/Order");


exports.getOrder = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate({
      path: "orderItems.product",
      select: "title",
    });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("error from getOrders", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
