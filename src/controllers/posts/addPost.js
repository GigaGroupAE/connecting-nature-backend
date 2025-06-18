const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const { Upload } = require("@aws-sdk/lib-storage");
const s3 = require("../../config/s3Client");
const Posts = require("../../models/post");
const UserModel = require("../../models/Register");
const { processAndUploadMedia } = require("../../services/mediaProcessor");

ffmpeg.setFfmpegPath(ffmpegPath);

const bucketName = process.env.AWS_BUCKET_NAME;

const uploadFileToS3 = async (filePath, fileName, mimeType) => {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: `uploads/${fileName}`,
    Body: fileStream,
    ContentType: mimeType,
  };

  const uploader = new Upload({
    client: s3,
    params: uploadParams,
  });

  await uploader.done();

  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
};

const addpost = async (req, res) => {
  try {
    let media = {};
    if (req.file) {
      media = await processAndUploadMedia(req.file);
    }

    const parsed = JSON.parse(req.body.postedby);
    const { description, ref, sharedBy } = req.body;

    const savedPost = await Posts.create({
      postedby: parsed,
      description,
      media,
      reactions: [],
      comments: [],
      shares: [],
      ref,
      sharedBy,
    });

    await UserModel.findByIdAndUpdate(req.user._id, { $inc: { points: 5 } });

    res.status(201).send(savedPost);
  } catch (err) {
    console.error("❌ Error in addpost:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = addpost;
