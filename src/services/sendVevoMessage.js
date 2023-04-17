const axios = require("axios");
exports.sendVevoMessage = async (number, message) => {
  try {
    const path =
      "https://api.veevotech.com/sendsms?hash=f4f05f33e9fdf3c9ecc9f95db89b67af&receivernum=" +
      number +
      "&screen_name=&sender_address=&textmessage=" +
      JSON.stringify(message) +
      "&sendernum=8583";
    let { data } = await axios.get(path);
    console.log("data is ", data);
    if (data.status === "ACCEPTED") {
      return data.status;
    } else {
      throw new Error("Failed to send message to user");
    }
  } catch (error) {
    console.log("error catched ", error);
  }
};
