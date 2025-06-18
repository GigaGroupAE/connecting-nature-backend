const register = require("../../models/Register");
const jwt = require("jsonwebtoken");
const { processAndUploadMedia } = require("../../services/mediaProcessor");

const signup = async (req, res) => {
  let s3Url = "";
  let createObj = {};

  if (req.body.location) {
    createObj.location = JSON.parse(req.body.location);
  }

  try {
    if (!req.file) {
      s3Url =
        "https://connecting-nature-media.s3.ap-south-1.amazonaws.com/uploads/no-profile-picture-placeholder.png";
    } else {
      const processed = await processAndUploadMedia(req.file);
      profileUrl = processed.name;
    }

    const newuser = new register({
      phoneNumber: req.body.phoneNumber,
      fullName: req.body.fullName,
      type: req.body.type,
      gender: req.body.gender,
      profile: profileUrl,
      ...createObj,
    });

    const phoneExist = await register.findOne({
      phoneNumber: newuser.phoneNumber,
    });
    if (phoneExist) {
      return res.status(400).send({
        statusCode: 400,
        message: "Phone Number Already Exists",
      });
    }

    const User = await newuser.save();
    const token = jwt.sign({ _id: User.id }, process.env.TOKEN_SECRET);
    res.header("auth_token", token).send(User);
  } catch (err) {
    console.log("Error in signup:", err);
    res.status(400).json({ message: err.message || err, status: 400 });
  }
};

module.exports = signup;
