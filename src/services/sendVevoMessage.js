const axios = require("axios");
exports.sendVevoMessage = async (number, message) => {
  const phoneNumber = "+92" + number.substring(1);

  try {
    const path =
      "https://api.veevotech.com/v3/sendsms?hash=31ed63e3a55c1b84877431ccfd532501&receivernum=" +
      phoneNumber +
      "&screen_name=&sender_address=&textmessage=" +
      JSON.stringify(message) +
      "&sendernum=8583";
    let { data } = await axios.get(path);

    if (data.status === "SUCCESSFUL") {
      return data.status;
    } else {
      throw new Error("Failed to send message to user");
    }
  } catch (error) {
    console.log("error catched ", error);
  }
};
