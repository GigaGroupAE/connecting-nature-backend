const signup = require("../../models/Register");
const jwt = require("jsonwebtoken");
const loginWeb = async (req, res) => {
  try {
    const User = await signup.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (!User) {
      res.send({ status: 400, message: "No User exist with this number" });
    } else {
      const token = jwt.sign({ _id: User.id }, process.env.TOKEN_SECRET);
      res.send({User,token});
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = loginWeb;
