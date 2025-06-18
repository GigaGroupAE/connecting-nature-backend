const stories = require("../../models/story");
const UserModel = require("../../models/Register");
const sharp = require("sharp");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require("path");
const { processAndUploadMedia } = require("../../services/mediaProcessor");

const videoOptions = {
  codec: "libx264",
  bitrate: "300k",
};

const addstory = async (req, res) => {
  console.log(req.body);
  try {
    let media = {};

    if (req.file) {
      media = await processAndUploadMedia(req.file);
    }

    let parsed = JSON.parse(req.body.postedby);
    const { description } = req.body;

    const savedstory = await stories.create({
      postedby: parsed,
      reactions: [],
      description: description,
      media: media,
      comments: [],
      shares: [],
    });

    await UserModel.findByIdAndUpdate(req.user._id, {
      $inc: { points: 5 },
    });
    res.send(savedstory);
  } catch (err) {
    console.log("error is ", err);
    res.status(400).send(err);
  }
};

module.exports = addstory;
