const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect("mongodb://localhost:27017/simpleChat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Message = mongoose.model("Message", new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now },
}));

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("✅ 사용자 접속");

  socket.on("chat message", async (msg) => {
    await Message.create({ text: msg });
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ 사용자 퇴장");
  });
});

server.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});
