const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const PORT = 3500;

io.on("connection", (socket) => {
  console.log("Connect!!!");

  socket.on("send_history", (history) => {
    io.emit("received_history", history);
  });

  socket.on("send_isWin", (isWin) => {
    io.emit("received_isWin", isWin);
  });

  socket.on("send_isDraw", (isDraw) => {
    io.emit("received_isDraw", isDraw);
  });

  socket.on("send_nextMove", (nextMove) => {
    io.emit("received_nextMove", nextMove);
  });

  socket.on("send_timeLeft", (timeLeft) => {
    io.emit("received_timeLeft", timeLeft);
  });

  socket.on("send_boardSize", (boardSize) => {
    io.emit("received_boardSize", boardSize);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect!!!");
  });
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
