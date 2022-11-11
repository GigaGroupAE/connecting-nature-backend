const express = require("express");
const authroutes = require("./src/routes/userroutes");
const postroutes = require("./src/routes/postroutes");
const todayroutes = require("./src/routes/to-day-routes");
const notification = require("./src/routes/notifications");
const groups = require("./src/routes/groups");
const chats = require("./src/routes/chatroute");
const disconnect = require("./src/sockets/disconnect");
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

require("./src/config/connection");
const app = express();
const server = http.createServer(app);

const client = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  },
});
//cross origin cors dependency
// methods: ["GET", "POST", "PUT", "PATCH"],
//app.use(express.json());

//TEMPORARY IMPORTS
const TEMPORARY_ROUTES = require("./src/routes/temporaryRoutes");

app.use(express.json());
app.use(cors());

//static configuration
app.use(express.static("./uploads"));
//send a req to this route along with the image name to get image
app.use("/images", express.static("uploads"));

app.use("/user", authroutes);
app.use("/posts", postroutes);
app.use("/today", todayroutes);
app.use("/notify", notification);
app.use("/chat", chats);
app.use("/groups", groups);
client.on("connection", (socket) => {
  console.log(`connection is made ${socket.id}`);
  socket.on("disconnect", disconnect);
  socket.on("chat", () => {});
});
app.use("/temporary", TEMPORARY_ROUTES);
server.listen(3000, () => {
  console.log("Server is running");
});
