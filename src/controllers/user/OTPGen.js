const axios = require("axios");

const OTPGen = async (req, res) => {
  const randomOTP = Math.floor(Math.random() * 9000) + 1000;
  const phoneNumber = req.body.phoneNumber;
  const formattedPhoneNumber = "+92" + phoneNumber.substring(1);

  const path =
    "https://api.veevotech.com/v3/sendsms?hash=31ed63e3a55c1b84877431ccfd532501&receivernum=" +
    formattedPhoneNumber +
    "&screen_name=&sender_address=&textmessage=" +
    JSON.stringify(randomOTP) +
    "&sendernum=8583";
  axios
    .get(path)
    .then((response) => {
      if (response.status === 200) {
        res.send({ message: randomOTP, status: 200 });
      }
    })
    .catch((e) => console.log(e));
};

module.exports = OTPGen;

// const OTPGen = async (req, res) => {
//   const randomOTP = "0000";

//   // Send the OTP "0000" as a response
//   res.send({ message: randomOTP, status: 200 });
// };

// module.exports = OTPGen;
