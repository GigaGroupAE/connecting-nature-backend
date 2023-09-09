const Posts = require("../../models/post");
const Users = require("../../models/Register");
const Notifications = require("../../models/notification");
const { sendNotifications } = require("../../services/sendNotifications");
exports.notifyPostAuthor = async (req, res) => {
  try {
    //1-we would receive a post id here
    //2-from the post id we will extract the number of posted by
    //3-from that number we will extract the expo token of the person
    //4-then we will send the notification to that person and also add a notification

    // #2
    let post = await Posts.findById(req.params.id).populate("postedby");
    let user = await Users.findOne({ phoneNumber: post.postedby.phoneNumber }); //this is the user who was the author of post

    // if (user.expoPushToken) {
    //   //send notification
    //   sendNotifications([user.expoPushToken], req.body.title);
    // }

    //save the notification into the database

    await Notifications.create({
      user: post.postedby._id,
      body: req.body.body,
      data: req.body.data,
    });

    return res.json({
      success: true,
      message: "notification succes",
    });
  } catch (error) {
    console.log("error inside notify post author is ", error);
    return res.json({ success: false, error });
  }
};
