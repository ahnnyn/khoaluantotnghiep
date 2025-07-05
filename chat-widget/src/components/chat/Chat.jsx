import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { Download } from "lucide-react";

import { format } from "timeago.js";
import { getUserById, fetchBacSiByMaBS, callUploadChatFile, saveMessage, fetchMessages } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import "./Chat.css";

const socket = io("http://localhost:5000"); // Server Socket.IO

const Chat = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");
  const currentUserID = searchParams.get("currentUserID");
  const currentUserRole = searchParams.get("currentRole");

  const [currentUserData, setCurrentUserData] = useState(null);
  const [receiverUserData, setReceiverUserData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });
  const [emojiOpen, setEmojiOpen] = useState(false);

  const scrollRef = useRef();

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUserRole === "benhnhan") {
          const currentUser = await getUserById(currentUserID);
          const receiverUser = await fetchBacSiByMaBS(doctorId);
          setCurrentUserData(currentUser.data);
          setReceiverUserData(receiverUser.data);
        } else if (currentUserRole === "bacsi") {
          const currentUser = await fetchBacSiByMaBS(currentUserID);
          const receiverUser = await getUserById(patientId);
          setCurrentUserData(currentUser.data);
          setReceiverUserData(receiverUser.data);
        }
      } catch (error) {
        console.error("Lỗi khi fetch người dùng:", error);
      }
    };

    fetchData();
  }, [currentUserID, currentUserRole, doctorId, patientId]);

  // Kết nối socket
  useEffect(() => {
    if (currentUserID) {
      socket.emit("addUser", currentUserID);
    }

    socket.on("receiveMessage", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentUserID]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetchMessages(appointmentId);
        if (res.success && Array.isArray(res.data)) {
          const formattedMessages = res.data.map((msg) => {
            const isImage = msg.loaitinnhan === "image";
            const isFile = msg.loaitinnhan === "file";
          
            return {
              senderId: msg.nguoigui_id,
              receiverId: currentUserRole === "benhnhan" ? doctorId : patientId,
              text: msg.noidung,
              img: isImage ? msg.file_url : null,
              file_url: isFile ? msg.file_url : null,
              createdAt: msg.thoigian,
              role: msg.role,
            };
          });
          
          setChatMessages(formattedMessages);
        } else {
          console.warn("Không lấy được tin nhắn từ API");
        }

      } catch (err) {
        console.error("Lỗi khi lấy tin nhắn:", err);
      }
    };
  
    if (appointmentId) {
      getMessages();
    }
  }, [appointmentId, currentUserRole, doctorId, patientId]);
  

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  

  const handleSendMessage = async () => {
    if (text.trim() !== "" || img.file) {
      const receiverId = currentUserRole === "benhnhan" ? doctorId : patientId;
      const now = new Date().toISOString();
  
      // Thiết lập tin nhắn cơ bản, ban đầu lấy nội dung là text (nếu có)
      const baseMessage = {
        nguoigui_id: currentUserID,
        role: currentUserRole,
        lichhen_id: appointmentId,
        noidung: text, // Nếu không có text, sau này sẽ cập nhật thành filename
        file_url: null,
        loaitinnhan: img.file ? "image" : "text", // tạm thời set là "text" nếu không có file
        thoigian: now,
      };
  
      // Payload gửi qua socket
      let socketPayload = {
        senderId: currentUserID,
        receiverId,
        text: text || null, // Nếu không có text, sẽ cập nhật thành filename nếu gửi file
        img: null,
        createdAt: now,
        role: currentUserRole,
      };
  
      try {
        // Nếu có file, upload file trước
        if (img.file) {
          const res = await callUploadChatFile(img.file);
          const data = res;
          if (!data?.url) throw new Error("Lỗi upload file");
  
          baseMessage.file_url = data.url;
          console.log("File URL:", data.url);
          // Kiểm tra xem file upload có phải ảnh không:
          const isImage = /^image\//.test(data.type);
  
          // Cập nhật loại tin nhắn: "image" nếu là ảnh, "file" nếu không phải ảnh
          baseMessage.loaitinnhan = isImage ? "image" : "file";
  
          // Nếu người dùng không nhập text, dùng tên file để lưu nội dung cho tin nhắn
          if (!text.trim()) {
            baseMessage.noidung = data.filename;
          }
  
          // Cập nhật socketPayload:
          socketPayload.img = isImage ? data.url : null;
          socketPayload.text = text.trim() || data.filename;
          socketPayload.file_url = data.url;
        }
        
        // Nếu không có file thì vẫn là tin nhắn văn bản
        if (!img.file) {
          socketPayload.img = null;
        }
  
        // Gửi tin nhắn qua socket để hiển thị ngay cho cả hai bên
        socket.emit("sendMessage", socketPayload);
        setChatMessages((prev) => [...prev, socketPayload]);
        // Reset giao diện
        setText("");
        setImg({ file: null, url: "" });
        setEmojiOpen(false);
  
        // Lưu tin nhắn vào DB
        const saveRes = await saveMessage(baseMessage);
        if (!saveRes.success) throw new Error(saveRes.error || "Lỗi lưu DB");
      } catch (err) {
        console.error("Lỗi gửi/lưu tin nhắn:", err);
        // Optional: roll back UI nếu cần
      }
    }
  };
  
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };

  const handleImg = async (e, type) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
  
    const isImage = /^image\//.test(selectedFile.type);
  
    if (type === "image" && !isImage) {
      alert("Chỉ được chọn file ảnh!");
      return;
    }
  
    if (type === "file" && isImage) {
      alert("Chỉ được chọn file tài liệu!");
      return;
    }
  
    const previewUrl = isImage ? URL.createObjectURL(selectedFile) : "";
  
    // Cập nhật ảnh đã chọn (chỉ để preview tạm thời nếu là ảnh)
    setImg({
      file: selectedFile,
      url: previewUrl,
    });
  
    // Gửi tin nhắn tự động
    try {
      const receiverId = currentUserRole === "benhnhan" ? doctorId : patientId;
      const now = new Date().toISOString();
  
      const uploadRes = await callUploadChatFile(selectedFile);
      const data = uploadRes;
      if (!data?.url) throw new Error("Lỗi upload file");
  
      const isImageFile = /^image\//.test(data.type);
      const fileUrl = data.url;
      const displayName = text || data.filename;
  
      const socketPayload = {
        senderId: currentUserID,
        receiverId,
        text: displayName,
        img: isImageFile ? fileUrl : null,
        file_url: fileUrl,
        createdAt: now,
        role: currentUserRole,
      };
  
      const baseMessage = {
        nguoigui_id: currentUserID,
        role: currentUserRole,
        lichhen_id: appointmentId,
        noidung: displayName,
        file_url: fileUrl,
        loaitinnhan: isImageFile ? "image" : "file",
        thoigian: now,
      };
  
      socket.emit("sendMessage", socketPayload);
      setChatMessages((prev) => [...prev, socketPayload]);
      setText("");
      setImg({ file: null, url: "" });
      setEmojiOpen(false);
  
      const saveRes = await saveMessage(baseMessage);
      if (!saveRes.success) throw new Error(saveRes.error || "Lỗi lưu DB");
    } catch (err) {
      console.error("Lỗi gửi/lưu file:", err);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn form submit hoặc reload
      handleSendMessage();
    }
  };
  
  const avatarUrl = (user) => {
    if (!user || !user.hinhAnh) return "./avatar.png";
    const isDoctor = Object.prototype.hasOwnProperty.call(user, "maBacSi");
    const folder = isDoctor ? "bacsi" : "benhnhan";
    return `${import.meta.env.VITE_BACKEND_URL}/public/${folder}/${user.hinhAnh}`;
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={avatarUrl(receiverUserData)} alt="" />
          <div className="texts">
            <span>{receiverUserData?.hoTen || "Người dùng"}</span>
            <p>Đang trò chuyện</p>
          </div>
        </div>
      </div>

      <div className="center">
        {chatMessages.map((msg, index) => {
          const isOwn = msg.senderId === currentUserID;
          const fileName = decodeURIComponent(msg.text || msg.file_url?.split("/").pop());

          return (
            <div
              key={index}
              ref={scrollRef}
              className={isOwn ? "message own" : "message"}
            >
              <div className="texts">
                {/* Hiển thị hình ảnh nếu có */}
                {msg.img && (
                  <img
                    src={
                      msg.img.startsWith("http")
                        ? msg.img
                        : import.meta.env.VITE_BACKEND_URL + msg.img
                    }
                    alt="chat-img"
                    className="chat-image"
                    style={{ maxWidth: "300px", borderRadius: "8px" }}
                  />
                )}

                {/* Hiển thị file nếu là tài liệu */}
                {(() => {
                  if (msg.img) {
                    return (
                      <img
                        src={
                          msg.img.startsWith("http")
                            ? msg.img
                            : import.meta.env.VITE_BACKEND_URL + msg.img
                        }
                        alt="chat-img"
                        className="chat-image"
                        style={{ maxWidth: "300px", borderRadius: "8px" }}
                      />
                    );
                  } else if (msg.file_url) {
                    return (
                      <div className="file-message" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ wordBreak: "break-word", color: "#007bff" }}>
                          📎 {fileName}
                        </span>
                        <a
                          href={import.meta.env.VITE_BACKEND_URL + msg.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          title="Tải xuống"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    );
                  } else if (msg.text) {
                    return <p>{msg.text}</p>;
                  } else {
                    return null;
                  }
                })()}

                <span>{format(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
    </div>
      <div className="bottom">
        <div className="icons">
          {/* Gửi ảnh */}
          <label htmlFor="img-upload">
            <img src="./img.png" alt="upload-image" title="Gửi ảnh" />
          </label>
          <input
            type="file"
            id="img-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImg(e, "image")}
          />

          {/* Gửi file */}
          <label htmlFor="file-upload">
            <img src="./attach_file_24dp_FFFF.png" alt="upload-file" title="Gửi file" />
          </label>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={(e) => handleImg(e, "file")}
          />
          {/* <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" /> */}
        </div>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt="emoji"
            onClick={() => setEmojiOpen((prev) => !prev)}
          />
          <div className="picker">{emojiOpen && <EmojiPicker onEmojiClick={handleEmoji} />}</div>
        </div>
        <button className="sendButton" onClick={handleSendMessage}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chat;
