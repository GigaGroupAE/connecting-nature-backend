const bucketsSchema = require("../../models/bucketsSchema");

exports.createBucket = async (req, res, next) => {
  try {
    const bucket = await bucketsSchema.create(req.body);
    return res.status(200).json({ success: true, bucket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
