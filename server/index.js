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
let players = {};

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  if (Object.keys(players).length >= 2) {
    socket.emit("game_full", "The game is full. Please try again later.");
    socket.disconnect();
    return;
  }

  if (socket.handshake.headers["origin"] !== "http://localhost:3000") {
    socket.disconnect();
    return;
  }

  const mark = Object.keys(players).length % 2 === 0 ? "X" : "O";
  players[socket.id] = mark;
  socket.emit("send_playerMark", mark);
  io.emit("update_players", players);

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
    console.log("A user disconnected: " + socket.id);
    delete players[socket.id];
    io.emit("update_players", players);
  });
});

server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
