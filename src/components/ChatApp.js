import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Audio for notifications
const notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3");
const ringtoneAudio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.mp3");

const SOCKET_SERVER_URL = "https://mobile-barbershop-backend.onrender.com";

const ChatApp = ({ clientId, isAdmin }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);

  const getCallPartnerId = useCallback(() => (isAdmin ? selectedClientId : "admin"), [isAdmin, selectedClientId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { auth: { token: localStorage.getItem("token") } });
    const socket = socketRef.current;

    socket.on("connect", () => console.log("Connected to WebSocket server."));

    socket.on("new_message", (data) => {
      if (isAdmin || data.senderId !== clientId) {
        setMessages((prev) => [...prev, { sender: data.sender, message: data.message }]);
        notificationAudio.play().catch(() => {});
        if (!isChatOpen || isMinimized) setUnreadCount((prev) => prev + 1);
      }
    });

    if (isAdmin) {
      socket.on("update_client_list", setClients);
    }

    socket.on("call_offer", (data) => {
      if (inCall) {
        socket.emit("call_reject", { to: data.from });
        return;
      }
      setIncomingCall(data);
      ringtoneAudio.loop = true;
      ringtoneAudio.play().catch(() => {});
    });

    socket.on("call_answer", async (data) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on("call_candidate", async (data) => {
      if (pcRef.current && data.candidate) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.on("call_reject", () => {
      alert("Call rejected.");
      endCall();
    });

    socket.on("call_end", endCall);

    return () => {
      socket.disconnect();
    };
  }, [isAdmin, inCall, isChatOpen, isMinimized, clientId]);

  const endCall = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setInCall(false);
    setCallType(null);
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
    socketRef.current?.emit("call_end", { to: getCallPartnerId() });
  }, [localStream, remoteStream, getCallPartnerId]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;
    if (isAdmin && !selectedClientId) return;
    socketRef.current?.emit(isAdmin ? "send_message_to_client" : "send_message_to_admin", {
      clientId: selectedClientId,
      message
    });
    setMessages((prev) => [...prev, { sender: isAdmin ? "admin" : "client", message }]);
    setMessage("");
  }, [message, isAdmin, selectedClientId]);

  return (
    <div className="chat-app">
      {!isChatOpen ? (
        <button onClick={() => setIsChatOpen(true)}>💬 {unreadCount > 0 && <span>{unreadCount}</span>}</button>
      ) : (
        <div className="chat-container">
          <button onClick={() => setIsChatOpen(false)}>X</button>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index}>{msg.sender}: {msg.message}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
      {inCall && <button onClick={endCall}>End Call</button>}
      <ToastContainer />
    </div>
  );
};

export default ChatApp;
