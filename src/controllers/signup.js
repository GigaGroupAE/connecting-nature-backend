const register = require("../models/Register");
const signup = async (req, res) => {
  if (!req.file)
    return res.send({ statusCode: 500, message: "no images found" });
  const newuser = new register({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    fullName: req.body.fullName,
    type: req.body.type,
    profile: req.file.path,
  });
  const phoneExist = await register.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (phoneExist) {
    return res.status(400).send("Phone Number Already Exists");
  }
  try {
    const savedUser = await newuser.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = signup;
