const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const { Upload } = require("@aws-sdk/lib-storage");
const s3 = require("../config/s3Client");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

ffmpeg.setFfmpegPath(ffmpegPath);

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;

const sanitizeFileName = (name) =>
  name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");

const uploadToS3 = async (filePath, fileName, mimeType) => {
  const stream = fs.createReadStream(filePath);
  const uploader = new Upload({
    client: s3,
    params: {
      Bucket: bucketName,
      Key: `uploads/messageMedia/${fileName}`,
      Body: stream,
      ContentType: mimeType,
    },
  });
  await uploader.done();
  return `https://${bucketName}.s3.${region}.amazonaws.com/uploads/messageMedia/${fileName}`;
};

const processAndUploadMessageMedia = async (file) => {
  const inputPath = file.path;
  const originalExt = path.extname(file.originalname);
  const originalName = file.originalname.replace(/\.[^/.]+$/, "");
  const safeName = sanitizeFileName(originalName);
  const timestamp = Date.now();

  const outputDir = path.join(__dirname, "../../uploads/messageMedia");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (file.mimetype.startsWith("video/")) {
    const outputName = `${timestamp}_${safeName}_compressed.mp4`;
    const outputPath = path.join(outputDir, outputName);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec("libx264")
        .videoBitrate("300k")
        .size("720x1280")
        .audioCodec("aac")
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    const s3Url = await uploadToS3(outputPath, outputName, "video/mp4");

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return {
      name: s3Url,
      type: "video/mp4",
      url: outputName,
    };
  }

  if (file.mimetype.startsWith("image/")) {
    const outputName = `${timestamp}_${safeName}_compressed.jpg`;
    const outputPath = path.join(outputDir, outputName);

    await sharp(inputPath)
      .resize({ width: 800 })
      .jpeg({ quality: 75 })
      .toFile(outputPath);

    const s3Url = await uploadToS3(outputPath, outputName, "image/jpeg");

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return {
      name: s3Url,
      type: "image/jpeg",
      url: outputName,
    };
  }

  // ✅ NEW: Handle audio, documents, and other file types without compression
  const outputName = `${timestamp}_${safeName}${originalExt}`;
  const outputPath = path.join(outputDir, outputName);

  fs.renameSync(inputPath, outputPath);

  const s3Url = await uploadToS3(outputPath, outputName, file.mimetype);

  fs.unlinkSync(outputPath);

  return {
    name: s3Url,
    type: file.mimetype,
    url: outputName,
  };
};

module.exports = { processAndUploadMessageMedia };
