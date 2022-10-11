const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    console.log("file", file);
    const filename = file.originalname;
    cb(null, filename);
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "images/jpeg" || file.mimetype === "images/png") {
      cb(file, true);
    } else {
      cb(new Error("Image file type invalid"), false);
    }
  },
});

module.exports = storage;
