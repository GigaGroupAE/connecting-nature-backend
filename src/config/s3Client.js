require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");

const s3 = new S3Client({
  region: "ap-south-1",
});

module.exports = s3;
