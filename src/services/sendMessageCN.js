const chat = require("../models/chats");

const sendmessage = async (data) => {
  try {
    const chatdata = await chat.findById(data.id);
    const messages = chatdata.messages;
    messages.push(data.message);
    if (!data.id) {
      console.log("invalid data");
    } else {
      try {
        const _id = data.id;
        const updatechat = await chat.findByIdAndUpdate(
          _id,
          { messages: messages },
          {
            new: true,
          }
        );
        if (!updatechat) {
          return "internal server error";
        } else {
          return updatechat;
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendmessage;
