const group = require("../models/groups");

const sendmessage = async (data) => {
  console.log(data);
  let tempdata = [];
  tempdata.push(data);
  if (!data.id) {
    console.log("invalid data");
  } else {
    try {
      const _id = data.id;
      const updategroup = await group.findByIdAndUpdate(
        _id,
        { messages: tempdata },
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
      //   res.status(400).send("Invalid data body");
    }
  }
  //   socket.emit("receive_message", data);
};

module.exports = sendmessage;
