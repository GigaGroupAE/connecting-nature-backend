const express = require("express");
const bodyParser = require("body-parser");
//admin-ui setup
const { instrument } = require("@socket.io/admin-ui");

//testing

const postModal = require("./src/models/post");
const storyModal = require("./src/models/story");
const campaignModal = require("./src/models/campaignsSchema");

//Routes
const authroutes = require("./src/routes/userroutes");
const postroutes = require("./src/routes/postroutes");
const todayroutes = require("./src/routes/to-day-routes");
const notification = require("./src/routes/notifications");
const groups = require("./src/routes/groups");
const chats = require("./src/routes/chatroute");
const invitesms = require("./src/routes/inviteroutes");
const upgradeRequest = require("./src/routes/upgradeRequestRoutes");
const archives = require("./src/routes/arhiveRoutes");
const storyroutes = require("./src/routes/storyroutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const campaignsRoutes = require("./src/routes/campaignRoutes");
const taskRoutes = require("./src/routes/tasksRoutes");
const bucketRoutes = require("./src/routes/bucketRoutes");

const decorations = require("./src/routes/decorationsRoutes");

//sockets
const disconnect = require("./src/sockets/disconnect");
//Services
const socketauth = require("./src/middlewares/socketauthentication/socketauth");
const sendmessage = require("./src/services/sendmessage");
const sendmessageCN = require("./src/services/sendMessageCN");
//TEMPORARY IMPORTS
const TEMPORARY_ROUTES = require("./src/routes/temporaryRoutes");

//Models
const GroupModel = require("./src/models/groups");
const MessageModel = require("./src/models/messageSchema");
const GroupMessageModel = require("./src/models/groupMessageSchema");
const OrderModel = require("./src/models/Order");
const ChatModel = require("./src/models/chats");

//server configuration imports
const http = require("http");
const cors = require("cors");
require("./src/config/connection");
require("dotenv/config");

//cron job
require("./src/controllers/do-day/cron-jobs");
const { Server } = require("socket.io");
const {
  sendGroupMessageNotifications,
} = require("./src/services/sendGroupMessageNotifications");
const { updatePoints } = require("./src/services/updateCampaignPoints");

//server configuration
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests from this origin
  })
);
const server = http.createServer(app);
const client = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: ["*", "https://admin.socket.io/", "http://localhost:3001"],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  },
});

app.get("/", (req, res) => {
  return res.send("Successful,Happy Coding");
});

//static configuration
app.use(express.static("./uploads"));
//send a req to this route along with the image name to get image
app.use("/images", express.static("uploads"));

//to get audio
app.use("/messageMedia", express.static("uploads/messageMedia"));

//traditional crud
app.use("/user", authroutes);
app.use("/posts", postroutes);
app.use("/today", todayroutes);
app.use("/notify", notification);
app.use("/chat", chats);
app.use("/groups", groups);
app.use("/temporary", TEMPORARY_ROUTES);
app.use("/sms", invitesms);
app.use("/upgradeRequests", upgradeRequest);
app.use("/archives", archives);
app.use("/story", storyroutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/campaigns", campaignsRoutes);
app.use("/task", taskRoutes);
app.use("/buckets", bucketRoutes);
app.use("/decorations", decorations);

client.use(socketauth);
//socket apis
client.on("connection", (socket) => {
  socket.on("join", async (data) => {
    socket.join(data.id);
  });
  socket.on("leave", (data) => {
    socket.leave(data.id);
  });

  socket.on("disconnect", disconnect);
  socket.on("chat", () => {});
  socket.on("update_points", async (data) => {
    const result = await updatePoints(data);

    client.to(data.group).emit("receive_points", result);
  });

  socket.on("send_message", async (data) => {
    //here send notifications
    try {
      //sendGroupMessageNotifications(data);
    } catch (error) {}
    const result = await sendmessage(data);
    // console.log("result is ", result);
    //this is the line causing the issue because .to is not working on it
    client
      .to(data.group)
      .emit("receive_message", result.messages[result.messages.length - 1]);
  });

  socket.on("send_messageCN", async (data) => {
    const result = await sendmessageCN(data);
    // console.log(result.messages[result.messages.length - 1]);
    client
      .to(data.chat)
      .emit("receive_message", result.messages[result.messages.length - 1]);
  });
  socket.on("Delete_messageCN", async (data) => {
    try {
      let chat = await ChatModel.findOne({ _id: data.chat });
      if (!chat) {
        return;
      }
      chat.messages = chat.messages.filter(
        (item) => item?._id.toString() !== data.id
      );
      await chat.save();
      await MessageModel.findByIdAndDelete({ _id: data.id });
      chat = await ChatModel.findOne({ _id: data.chat });
      const messageIds = chat?.messages;
      const messages = await MessageModel.find({ _id: { $in: messageIds } });
      client
        .to(data.chat, messages)
        .emit("Deleted_messageCN", data.id, messages);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("Delete_message", async (data) => {
    try {
      const group = await GroupModel.findOne({ _id: data.groupId });

      if (!group) {
        return;
      }
      group.messages = group.messages.filter(
        (item) => item?._id.toString() !== data.id
      );

      await group.save();
      await GroupMessageModel.findByIdAndDelete({ _id: data.id });

      const updatedGroup = await GroupModel.findOne({ _id: data.groupId });
      const messageIds = updatedGroup?.messages;
      const messages = await GroupMessageModel.find({
        _id: { $in: messageIds },
      })
        .populate({
          path: "from",
          select:
            "profile fullName phoneNumber type expoPushToken additionalField", // Add the additional fields you want to select
        })
        .exec();
      client
        .to(data.groupId, messages)
        .emit("Delete_message", data.id, messages);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("update_Message", async (data) => {
    let group = await GroupModel.findOne({ _id: data.id });
    group.messages = group.messages.map(async (m) => {
      if (m.id === data.MessageID) {
        await OrderModel.findByIdAndUpdate(
          { _id: m.content.id },
          {
            assigned_to: data.user,
          }
        );
        return { ...m, status: "ACCEPTED" };
      } else {
        return m;
      }
    });

    const result = await GroupModel.findByIdAndUpdate(
      { _id: data.id },
      { messages: group.messages },
      {
        new: true,
      }
    );
    client.to(data.id).emit("update_message", data);
  });
});

client.of("/CN").on("connection", (socket) => {
  socket.on("send_comments", async (data) => {
    // console.log(data);
    const post = await postModal.find({ _id: data._id }).populate({
      path: "comments",
      populate: {
        path: "commented_by",
        select: "profile fullName phoneNumber type",
      },
    });
    // console.log(post[0].comments);
    socket.emit("receive_comments", post[0].comments);
  });
  // story comments

  socket.on("send_comments_story", async (data) => {
    // console.log(data);
    const post = await storyModal.find({ _id: data._id }).populate({
      path: "comments",
      populate: {
        path: "commented_by",
        select: "profile fullName phoneNumber type",
      },
    });
    socket.emit("receive_comments_story", post[0].comments);
  });

  // story comments end

  socket.on("send_comments_campaign", async (data) => {
    const campaign = await campaignModal.find({ _id: data._id });
    socket.emit("receive_comments_campaign", campaign[0].comments);
  });

  socket.on("send_posts", (data) => {
    socket.emit("receive_posts", data);
  });
  socket.on("send_message", (data) => {
    socket.emit("receive_message", data);
  });
});
instrument(client, {
  auth: false,
});
server.listen(3000, () => {
  console.log("Server is running");
});
