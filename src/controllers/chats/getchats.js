const chats = require("../../models/chats");
const Users = require("../../models/Register");

exports.getchats = async (req, res) => {
  const getchats = await chats.find();
  return res.status(200).send(getchats);
};


//this route will return chats of the user who has requested

exports.getMyChats = async (req, res) => {
  try {
    let activeUser = await Users.findById(req.user._id);
    let blockedUsers = activeUser.blockedUsers
    let blockedByUsers = activeUser.blockedByUsers

    let exculde = [...blockedByUsers,...blockedUsers]
    let myChats = await chats.find({
      $and: [
        { "members.phoneNumber": activeUser.phoneNumber }, // this lines gives us our chats only
        { "members.phoneNumber": { $nin: exculde } }, // here exculde those chats where users have blocked each other
      ],
    });
    //now filter data here

    return res.json({ success: true, myChats });
  } catch (error) {
    console.log("error in get my chats is ", error);
    return res.json({ success: false, message: "internal server error" });
  }
};
