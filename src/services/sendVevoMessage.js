const axios = require("axios");
exports.sendVevoMessage = async (number, message) => {
  try {
    const path =
      "https://api.veevotech.com/sendsms?hash=f4f05f33e9fdf3c9ecc9f95db89b67af&receivernum=" +
      number +
      "&screen_name=&sender_address=&textmessage=" +
      JSON.stringify(message) +
      "&sendernum=8583";
    let { data } = axios.get(path);
    if (data.status === 200) {
      return data.status;
    } else {
      throw new Error("Failed to send message to user");
    }
  } catch (error) {
    throw new Error("Failed to send message to user");
  }
};
