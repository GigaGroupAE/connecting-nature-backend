const group = require("../models/groups");

const sendmessage = async (data) => {
  try {
    const groupdata = await group.findById(data.id);
    const messages = groupdata.messages;
    messages.push(data);
    if (!data.id) {
      console.log("invalid data");
    } else {
      try {
        const _id = data.id;
        const updategroup = await group.findByIdAndUpdate(
          _id,
          { messages: messages },
          {
            new: true,
          }
        );
        if (!updategroup) {
          return "internal server error";
        } else {
          return updategroup;
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
