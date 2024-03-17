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
    // let blockedUsers = activeUser?.blockedUsers?.map((val) => val.phoneNumber);
    // let blockedByUsers = activeUser?.blockedByUsers?.map(
    //   (val) => val.phoneNumber
    // );

    let exculde = [...activeUser.blockedByUsers, ...activeUser.blockedUsers];

    // let myChats = await chats.find({
    //   $and: [
    //     { "members.phoneNumber": activeUser.phoneNumber }, // this lines gives us our chats only
    //     { "members.phoneNumber": { $nin: exculde } }, // here exculde those chats where users have blocked each other
    //   ],
    // });
    //now filter data here

    //let myChats = await chats.find().populate("members").populate("messages");
    let myChats = await chats
      .find({
        $and: [{ members: req.user._id }, { members: { $nin: exculde } }],
      })
      .populate("members")
      .populate("messages");
    myChats = myChats.filter((chat) => chat.messages.length > 0);

    return res.json({ success: true, myChats });
  } catch (error) {
    return res.json({ success: false, message: "internal server error" });
  }
};

exports.getOrCreateChat = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    // Check if a chat already exists between the two users
    let existingChat = await chats
      .findOne({
        members: { $all: [userId, id] },
      })
      .populate("members")
      .populate("messages");

    if (existingChat) {
      return res.json({ chat: existingChat });
    } else {
      const newChat = new chats({
        members: [userId, id],
        messages: [],
      });

      await newChat.save();

      // Populate the members field of the new chat
      existingChat = await newChat.populate("members");

      return res.json({ chat: existingChat });
    }
  } catch (error) {
    console.error("Error occurred while getting or creating chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
