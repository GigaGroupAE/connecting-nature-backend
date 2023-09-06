const register = require("../../models/Register");
const jwt  = require("jsonwebtoken")
const signup = async (req, res) => {
  console.log("signup called")
  let path = "";
  let createObj = {}
  if (req.body.location){

    let parsedLocation = JSON.parse(req.body.location);
    createObj.location = parsedLocation
  }
  if (req.file === undefined) {
    path = "no-profile-picture-placeholder.png";
  } else {
    path = req.file.filename;
  }
  const newuser = new register({
    email: "",
    phoneNumber: req.body.phoneNumber,
    fullName: req.body.fullName,
    type: req.body.type,
    expoPushToken:"",
    //this picture shall be retrieve by sending network request to {HOSTNAME/images/:profile}
    profile: path, //saving the name of the file to the database
    ...createObj
  });
  const phoneExist = await register.findOne({
    phoneNumber: newuser.phoneNumber,
  });
  if (phoneExist !== null) {
    console.log(phoneExist);
    return res.status(400).send({
      statusCode: 400,
      message: "Phone Number Already Exists",
    });
  }
  try {
    console.log("inside try")
    const User = await newuser.save();
    //copy the login logic here
    const token = jwt.sign({ _id: User.id }, process.env.TOKEN_SECRET);
    console.log("sending this back")
    res.header("auth_token", token).send(User);
  } catch (err) {
    console.log("inside catch error is " , err)
    res.status(400).json({ message: err, status: 400 });
  }
};

module.exports = signup;
