const express = require("express");
const authroutes = require("./src/routes/userroutes");
const postroutes = require("./src/routes/postroutes");
const todayroutes = require("./src/routes/to-day-routes");
const notification = require("./src/routes/notifications");
require("./src/config/connection");
const app = express();
app.use(express.json());
app.use("/user", authroutes);
app.use("/posts", postroutes);
app.use("/today", todayroutes);
app.use("/notify", notification);
app.listen(3000, () => {
  console.log("Server is running");
});
