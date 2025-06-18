const fs = require("fs");
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/s3Client");
const { BUCKET_NAME } = require("../config/s3Config");

const uploadToS3 = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file to upload"));
  }

  const filePath = req.file.path;
  const fileName = path.basename(filePath);

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fs.createReadStream(filePath),
    ContentType: req.file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));

    req.file.s3Key = fileName;
    req.file.s3Url = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${fileName}`;

    // Delete local file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    next();
  } catch (err) {
    console.error("S3 upload failed:", err);
    next(err);
  }
};

module.exports = uploadToS3;
