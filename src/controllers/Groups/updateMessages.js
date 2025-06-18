const model = require("../../models/groups");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const {
  processAndUploadMessageMedia,
} = require("../../services/processAndUploadMessageMedia");
ffmpeg.setFfmpegPath(ffmpegPath);

const videoOptions = {
  codec: "libx264",
  bitrate: "100k",
  size: "720x1280",
};

const updategroup = async (req, res) => {
  try {
    const uploadedFile = req.file;
    if (!uploadedFile) {
      return res.status(400).send("No file uploaded.");
    }

    const result = await processAndUploadMessageMedia(uploadedFile);
    console.log(result, "result");

    // You can optionally update a group document here
    // await model.findByIdAndUpdate(req.params.groupId, {
    //   $push: { media: result } // assuming you have a `media` array field
    // });

    return res.status(200).json({
      message: "File uploaded successfully",
      path: result?.name,
    });
  } catch (err) {
    console.error("Error in updategroup:", err);
    res.status(500).send("Internal server error.");
  }
};

module.exports = updategroup;
