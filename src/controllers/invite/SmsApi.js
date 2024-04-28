const axios = require("axios");

const SMsApi = async (req, res) => {
  const message = req.body.message;
  console.log(req.body);

  let phoneNumber;
  if (req.body.phoneNumber?.length === 11) {
    phoneNumber = "+92" + req.body.phoneNumber.substring(1);
  } else {
    phoneNumber === req.body.phoneNumber;
  }

  console.log(phoneNumber, "phone");

  const path =
    "https://api.veevotech.com/sendsms?hash=31ed63e3a55c1b84877431ccfd532501&receivernum=" +
    phoneNumber +
    "&screen_name=&sender_address=&textmessage=" +
    JSON.stringify(message) +
    "&sendernum=8583";
  axios
    .get(path)
    .then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        res.send({ message: message, status: 200 });
      }
    })
    .catch((e) => console.log(e));
};

module.exports = SMsApi;
