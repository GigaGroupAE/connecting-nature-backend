const mongoose = require("mongoose");
const model = require("../../models/Register");
const { processAndUploadMedia } = require("../../services/mediaProcessor");

const updateuser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user ID format");
  }

  try {
    const updateFields = {};

    if (
      typeof req.body.fullName === "string" &&
      req.body.fullName.trim() !== ""
    ) {
      updateFields.fullName = req.body.fullName.trim();
    }

    if (req.file) {
      const processed = await processAndUploadMedia(req.file);
      updateFields.profile = processed.name;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send("No valid fields provided for update");
    }

    const updatedUser = await model.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateuser;
