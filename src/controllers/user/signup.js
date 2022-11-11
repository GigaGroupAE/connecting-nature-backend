const register = require("../../models/Register");
const signup = async (req, res) => {
  const newuser = new register({
    email: "",
    phoneNumber: req.body.phoneNumber,
    fullName: req.body.fullName,
    type: req.body.type,
    //this picture shall be retrieve by sending network request to {HOSTNAME/images/:profile}
    profile: req.file.filename, //saving the name of the file to the database
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
