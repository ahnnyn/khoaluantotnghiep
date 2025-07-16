import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

// Dùng Map<string, string> để lưu userId -> socketId
const onlineUsers = new Map<string, string>();

export const initSocketServer = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3003"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("Current online users:", Array.from(onlineUsers.entries()));

      // Gửi danh sách người dùng online về cho client
      io.to(socket.id).emit("onlineUsersList", Array.from(onlineUsers.keys()));
    });

    socket.on(
      "sendMessage",
      ({
        senderId,
        receiverId,
        text,
        img,
      }: {
        senderId: string;
        receiverId: string;
        text: string;
        img?: string;
      }) => {
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
      }
    );

    // WebRTC signaling
    socket.on(
      "webrtc-offer",
      ({ to, from, offer }: { to: string; from: string; offer: any }) => {
        const receiverSocketId = onlineUsers.get(to);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("webrtc-offer", { from, offer });
        }
      }
    );

    socket.on(
      "webrtc-answer",
      ({ to, from, answer }: { to: string; from: string; answer: any }) => {
        const receiverSocketId = onlineUsers.get(to);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("webrtc-answer", { from, answer });
        }
      }
    );

    socket.on(
      "webrtc-ice-candidate",
      ({ to, from, candidate }: { to: string; from: string; candidate: any }) => {
        const receiverSocketId = onlineUsers.get(to);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("webrtc-ice-candidate", { from, candidate });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  console.log("Socket.IO server initialized");
};
