const express = require("express");

//admin-ui setup
const { instrument } = require("@socket.io/admin-ui");

//testing

const postModal = require("./src/models/post");

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
const OrderModel = require("./src/models/Order");

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
app.use(cors());
const server = http.createServer(app);
const client = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: ["*", "https://admin.socket.io/"],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  },
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

client.use(socketauth);
//socket apis
client.on("connection", (socket) => {
  socket.on("join", async (data) => {
    socket.join(data.id);
    console.log(`connected in chat ${data.id} using id ${socket.id}`);
  });
  socket.on("leave", (data) => {
    socket.leave(data.id);
    console.log(`left in chat ${data.id} using id ${socket.id}`);
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
    } catch (error) {
      console.log("error inside send_message notification:::", error);
    }
    const result = await sendmessage(data);
    console.log("result is ", result);
    //this is the line causing the issue because .to is not working on it
    client
      .to(data.group)
      .emit("receive_message", result.messages[result.messages.length - 1]);
  });
  socket.on("send_messageCN", async (data) => {
    //here send notifications
    try {
      //sendGroupMessageNotifications(data);
    } catch (error) {
      console.log("error inside send_message notification:::", error);
    }
    const result = await sendmessageCN(data);
    console.log(result.messages[result.messages.length - 1]);
    client
      .to(data.chat)
      .emit("receive_message", result.messages[result.messages.length - 1]);
  });
  socket.on("update_Message", async (data) => {
    let group = await GroupModel.findOne({ _id: data.id });
    console.log(group);
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
  console.log("connected in CN");
  socket.on("send_comments", async (data) => {
    const post = await postModal.find({ _id: data._id }).populate({
      path: "comments",
      populate: {
        path: "commented_by",
        select: "profile fullName phoneNumber type",
      },
    });
    console.log(post[0].comments);
    socket.emit("receive_comments", post[0].comments);
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
server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
