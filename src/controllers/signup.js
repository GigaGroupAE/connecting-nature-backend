const register = require("../models/Register");
const signup = async (req, res) => {
  if (!req.body.fd._parts[0])
    return res.send({ statusCode: 500, message: "no images found" });
  const newuser = new register({
    email: req.body.email,
    phoneNumber: req.body.fd._parts[2][1],
    fullName: req.body.fd._parts[1][1],
    type: req.body.fd._parts[3][1],
    profile: req.body.fd._parts[0][1].uri,
  });
  const phoneExist = await register.findOne({
    phoneNumber: newuser.phoneNumber,
  });
  if (phoneExist !== null) {
    console.log(phoneExist);
    return res.send({
      statusCode: 400,
      message: "Phone Number Already Exists",
    });
  }
  try {
    const savedUser = await newuser.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = signup;
