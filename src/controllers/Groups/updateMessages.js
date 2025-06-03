const model = require("../../models/groups");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
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

    const mimeType = uploadedFile.mimetype;
    const originalFilePath = uploadedFile.path;

    if (mimeType === "video/mp4") {
      // Video compression logic
      console.log("video");
      const outputFileName =
        uploadedFile.filename.replace(/\.[^/.]+$/, "") + "_compressed.mp4";
      const outputFilePath = path.join(
        __dirname,
        "../../../uploads/messageMedia",
        outputFileName
      );

      await new Promise((resolve, reject) => {
        ffmpeg(originalFilePath)
          .videoCodec(videoOptions.codec)
          .videoBitrate(videoOptions.bitrate)
          .size(videoOptions.size)
          .audioCodec("aac")
          .on("end", () => {
            fs.rename(originalFilePath, outputFilePath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
                console.log("Video compression successful");
              }
            });
          })
          .on("error", (err) => {
            reject(err);
          })
          .save(outputFilePath);
      });

      res.status(200).send({ path: outputFileName });
    } else if (mimeType.startsWith("image/")) {
      // Image compression logic
      const originalName = req.file.originalname.replace(/\.[^/.]+$/, "");
      const safeName = originalName
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "");
      const outputImageName = Date.now() + safeName + "_compressed.jpg";
      const outputImagePath = path.join(
        __dirname,
        "../../../uploads/messageMedia",
        outputImageName
      );

      await sharp(originalFilePath)
        .resize(800, null, { fit: "inside" })
        .toFile(outputImagePath);

      fs.unlink(originalFilePath, (err) => {
        if (err) {
          console.error("Error deleting original image:", err);
        }
      });

      res.status(200).send({ path: outputImageName });
    } else {
      // For other file types, no compression is needed
      res.status(200).send({ path: uploadedFile.filename });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal server error.");
  }
};

module.exports = updategroup;
