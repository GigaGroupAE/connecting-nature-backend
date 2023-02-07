const express = require("express");

//admin-ui setup
const { instrument } = require("@socket.io/admin-ui");

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

//sockets
const disconnect = require("./src/sockets/disconnect");
//Services
const socketauth = require("./src/middlewares/socketauthentication/socketauth");
const sendmessage = require("./src/services/sendmessage");
const sendmessageCN = require("./src/services/sendMessageCN");
//TEMPORARY IMPORTS
const TEMPORARY_ROUTES = require("./src/routes/temporaryRoutes");

//server configuration imports
const http = require("http");
const cors = require("cors");
require("./src/config/connection");
require("dotenv/config");
const { Server } = require("socket.io");
const {
  sendGroupMessageNotifications,
} = require("./src/services/sendGroupMessageNotifications");

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

client.use(socketauth);
//socket apis
client.on("connection", (socket) => {
  console.log("connected");
  socket.on("disconnect", disconnect);
  socket.on("chat", () => {});
  socket.on("send_message", async (data) => {
    //here send notifications
    try {
      sendGroupMessageNotifications(data);
    } catch (error) {
      console.log("error inside send_message notification:::", error);
    }
    socket.join(data.id);
    const result = await sendmessage(data);
    console.log(result.messages[result.messages.length - 1]);
    socket.emit("receive_message", result.messages[result.messages.length - 1]);
  });
});
client.of("/chatCN").on("connection", (socket) => {
  console.log("connected in /chatcn");
  socket.on("disconnect", disconnect);
  socket.on("chat", () => {});
  socket.on("send_message", async (data) => {
    //here send notifications
    try {
      //sendGroupMessageNotifications(data);
    } catch (error) {
      console.log("error inside send_message notification:::", error);
    }
    socket.join(data.id);
    const result = await sendmessageCN(data);
    console.log(result.messages[result.messages.length - 1]);
    socket.emit("receive_message", result.messages[result.messages.length - 1]);
  });
});
client.of("/CN").on("connection", (socket) => {
  console.log("connected in CN");
  socket.on("send_comments", (data) => {
    socket.emit("receive_comments", data);
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
