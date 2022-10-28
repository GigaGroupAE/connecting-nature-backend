const register = require("../../models/Register");
const signup = async (req, res) => {
  console.log("this is the file", req.body);
  const newuser = new register({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    fullName: req.body.fullName,
    type: req.body.type,
    profile: req.body.profile,
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
    res.send({ message: err, status: 400 });
  }
};

module.exports = signup;
