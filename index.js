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

//sockets
const disconnect = require("./src/sockets/disconnect");

//testing writefile

const uploaddocument = require("./src/middlewares/socketmediaupload/socketmediaupload");

//Services
const socketauth = require("./src/middlewares/socketauthentication/socketauth");
const sendmessage = require("./src/services/sendmessage");

//TEMPORARY IMPORTS
const TEMPORARY_ROUTES = require("./src/routes/temporaryRoutes");

//server configuration imports
const http = require("http");
const cors = require("cors");
require("./src/config/connection");
const { Server } = require("socket.io");

//server configuration
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const client = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io/"],
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

client.use(socketauth);
//socket apis
client.on("connection", (socket) => {
  console.log("connected");
  socket.on("disconnect", disconnect);
  socket.on("chat", () => {});
  socket.on("test", (data) => {
    // console.log(data);
    const result = uploaddocument(data);
    console.log(result);
  });
  socket.on("send_message", async (data) => {
    socket.join(data.id);
    const result = await sendmessage(data);
    console.log(result.messages);
    socket.emit("receive_message", data);
  });
});
instrument(client, {
  auth: false,
});
server.listen(3000, () => {
  console.log("Server is running");
});
