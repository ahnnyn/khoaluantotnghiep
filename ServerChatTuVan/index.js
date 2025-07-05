const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3003", "http://localhost:3000"], // Thêm các origin bạn cần
    methods: ["GET", "POST"],
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Current online users:", onlineUsers);
    
    // Gửi danh sách user đã online cho client để xác định thứ tự
    io.to(socket.id).emit("onlineUsersList", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, img }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    const message = {
      senderId,
      text,
      img,
      createdAt: new Date(),
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
    }
  });

  // WebRTC signaling
  socket.on("webrtc-offer", ({ to, from, offer }) => {
    const receiverSocketId = onlineUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("webrtc-offer", { from, offer });
    }
  });

  socket.on("webrtc-answer", ({ to, from, answer }) => {
    const receiverSocketId = onlineUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("webrtc-answer", { from, answer });
    }
  });

  socket.on("webrtc-ice-candidate", ({ to, from, candidate }) => {
    const receiverSocketId = onlineUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("webrtc-ice-candidate", { from, candidate });
    }
  });

  // Ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let [userId, sockId] of onlineUsers) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Socket.IO server running on port 5000");
});
