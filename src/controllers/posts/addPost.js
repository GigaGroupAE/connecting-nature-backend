const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const Posts = require("../../models/post");
const UserModel = require("../../models/Register");
const fs = require("fs");
const path = require("path");

const videoOptions = {
  codec: "libx264",
  bitrate: "400k", // Adjust to an appropriate value
  size: "720x1280", // Adjust to a lower resolution
};

const addpost = async (req, res) => {
  console.log(req.body);
  try {
    let media = {};

    if (req.file) {
      if (req.file.mimetype === "video/mp4") {
        // Video compression logic
        const inputFilePath = req.file.path; // Path to the uploaded video
        const outputFileName =
          req.file.filename.replace(/\.[^/.]+$/, "") + "_compressed.mp4"; // New filename for compressed video
        const outputFilePath = path.join(
          __dirname,
          "../../../uploads",
          outputFileName
        ); // Destination for compressed video

        // Compress the video
        await new Promise((resolve, reject) => {
          ffmpeg(inputFilePath)
            .videoCodec(videoOptions.codec)
            .videoBitrate(videoOptions.bitrate)
            .size(videoOptions.size)
            .audioCodec("aac")
            .on("end", () => {
              media = {
                name: req.file.filename,
                type: req.file.mimetype,
                compressedPath: "/videos/compressed/" + req.file.filename, // Use a relative path or URL
              };

              // Replace the original file with the compressed video
              fs.rename(outputFilePath, inputFilePath, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            })
            .on("error", (err) => {
              reject(err);
            })
            .save(outputFilePath); // Save the compressed video to a different file
        });
      } else {
        // Handle image upload as before
        media = {
          name: req.file.filename,
          type: req.file.mimetype,
        };
      }
    }

    // Parsing the postedby object
    let parsed = JSON.parse(req.body.postedby);
    const { description } = req.body;

    const savedpost = await Posts.create({
      postedby: parsed,
      description,
      reactions: [],
      comments: [],
      shares: [],
      media: media,
    });

    // Increasing points of the user
    await UserModel.findByIdAndUpdate(req.user._id, {
      $inc: { points: 5 },
    });

    res.send(savedpost);
  } catch (err) {
    console.error("Error:", err);
    res.status(400).send(err);
  }
};

module.exports = addpost;