import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://192.168.10.8:5174",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (data) => {
    socket.broadcast.emit("message", {
      message: data,
      date: new Date().toISOString(),
      from: socket.id.slice(5),
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
io.listen(8000); // Parece que especificando un puerto aparte para el socket.io, se soluciona el problema de CORS
app.listen(4000, () => {
  console.log("Server is running on port 4000");
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
});
