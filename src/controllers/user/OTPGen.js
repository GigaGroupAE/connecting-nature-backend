const axios = require("axios");

const OTPGen = async (req, res) => {
  console.log(req.body);
  const randomOTP = Math.floor(Math.random() * 9000) + 1000;

  const path =
    "https://api.veevotech.com/sendsms?hash=f4f05f33e9fdf3c9ecc9f95db89b67af&receivernum=" +
    req.body.phoneNumber +
    "&screen_name=&sender_address=&textmessage=" +
    JSON.stringify(randomOTP) +
    "&sendernum=8583";
  axios
    .get(path)
    .then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        res.send({ message: randomOTP, status: 200 });
      }
    })
    .catch((e) => console.log(e));
};

module.exports = OTPGen;
