import React, { useEffect, useRef, useState } from "react";
import {
  FaPhone,
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { getUserById, fetchDoctorByID } from "../services/api";

import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import "./VideoCall.css";

const VideoCallPage = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");
  const currentUserID = searchParams.get("currentUserID");
  const currentUserRole = searchParams.get("currentRole");
  const [currentUserData, setCurrentUserData] = useState(null);
  const [receiverUserData, setReceiverUserData] = useState(null);

  const myVideo = useRef(null);
  const peerVideo = useRef(null);
  const localStream = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [callStarted, setCallStarted] = useState(false);

  const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const otherUserId = currentUserID === patientId ? doctorId : patientId;

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(iceServers);

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.current);
      });
    }

    pc.ontrack = (event) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("webrtc-ice-candidate", {
          candidate: event.candidate,
          to: otherUserId,
          from: currentUserID,
        });
      }
    };

    return pc;
  };

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUserRole === "benhnhan") {
          const currentUser = await getUserById(currentUserID);
          const receiverUser = await fetchDoctorByID(doctorId);
          setCurrentUserData(currentUser.data);
          setReceiverUserData(receiverUser.data);
        } else if (currentUserRole === "bacsi") {
          const currentUser = await fetchDoctorByID(currentUserID);
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

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.emit("addUser", currentUserID);

    socket.current.on("webrtc-offer", async ({ from, offer }) => {
      if (!peerConnection.current) {
        peerConnection.current = createPeerConnection();
      }
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.current.emit("webrtc-answer", {
        to: from,
        from: currentUserID,
        answer,
      });

      setCallStarted(true);
    });

    socket.current.on("webrtc-answer", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.current.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      } catch (err) {
        console.error("Lỗi add ICE candidate:", err);
      }
    });

    return () => {
      socket.current.disconnect();
      if (peerConnection.current) peerConnection.current.close();
      peerConnection.current = null;
    };
  }, [appointmentId, currentUserID, otherUserId]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        if (myVideo.current) myVideo.current.srcObject = stream;
      })
      .catch((err) => console.error("Lỗi getUserMedia:", err));
  }, []);

  const startCall = async () => {
    if (callStarted) return;
    peerConnection.current = createPeerConnection();

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.current.emit("webrtc-offer", {
      offer,
      to: otherUserId,
      from: currentUserID,
    });

    setCallStarted(true);
  };

  const toggleCamera = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraEnabled(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
    }
  };

  const leaveCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;

    if (myVideo.current) myVideo.current.srcObject = null;
    if (peerVideo.current) peerVideo.current.srcObject = null;

    socket.current.disconnect();
    setCallStarted(false);
  };

  const LocalControls = () => (
    <div className="video-controls">
      {!callStarted && (
        <button onClick={startCall} title="Bắt đầu gọi" className="btn blue">
          <FaPhone size={20} />
        </button>
      )}
      {callStarted && (
        <button onClick={leaveCall} title="Rời cuộc gọi" className="btn red">
          <FaPhoneSlash size={20} />
        </button>
      )}
      <button
        onClick={toggleCamera}
        title={cameraEnabled ? "Tắt camera" : "Bật camera"}
        className="btn blue"
      >
        {cameraEnabled ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
      </button>
      <button
        onClick={toggleMic}
        title={micEnabled ? "Tắt mic" : "Bật mic"}
        className="btn blue"
      >
        {micEnabled ? (
          <FaMicrophone size={20} />
        ) : (
          <FaMicrophoneSlash size={20} />
        )}
      </button>
    </div>
  );

  return (
    <div className="video-container">
      <div className="video-box">
        <video ref={myVideo} autoPlay playsInline muted className="video" />
        <div className="label">
          Bạn ({currentUserRole === "benhnhan" ? "Bệnh nhân" : "Bác sĩ"})
        </div>
        <LocalControls />
      </div>

      <div className="video-box">
        <video ref={peerVideo} autoPlay playsInline className="video" />
        <div className="label">
          {currentUserRole === "benhnhan"
            ? `Bác sĩ (${receiverUserData?.hoTen || "Đang tải..."})`
            : `Bệnh nhân (${receiverUserData?.hoTen || "Đang tải..."})`}
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
