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
  // Chat states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Call states
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null); // "audio" or "video"
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Helper function to get the call partner ID
  const getCallPartnerId = useCallback(() => (isAdmin ? selectedClientId : "admin"), [isAdmin, selectedClientId]);

  // Enable audio on user interaction
  useEffect(() => {
    const enableAudio = () => {
      ringtoneAudio.play()
        .then(() => {
          ringtoneAudio.pause();
          ringtoneAudio.currentTime = 0;
          document.removeEventListener("click", enableAudio);
        })
        .catch((err) => console.log("Audio not allowed yet", err));
    };
    document.addEventListener("click", enableAudio);
    return () => {
      document.removeEventListener("click", enableAudio);
    };
  }, []);

  // Scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // End the current call
  const endCall = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    setInCall(false);
    setCallType(null);
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
    if (socket) {
      socket.emit("call_end", { to: getCallPartnerId() });
    }
  }, [localStream, remoteStream, socket, getCallPartnerId]);

  // Socket.IO connection and event handlers
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem("token") },
    });
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server.");
    });

    newSocket.on("new_message", (data) => {
      if (!isAdmin && data.senderId === clientId) return;
      setMessages((prev) => [
        ...prev,
        { sender: data.sender, message: data.message },
      ]);
      notificationAudio.play().catch((error) => console.error("Audio error:", error));
      if (Notification.permission === "granted") {
        new Notification(`Message from ${data.sender}`, { body: data.message });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(`Message from ${data.sender}`, { body: data.message });
          }
        });
      } else {
        toast.info(`New message from ${data.sender}: ${data.message}`);
      }
      if (!isChatOpen || isMinimized) setUnreadCount((prev) => prev + 1);
    });

    if (isAdmin) {
      newSocket.on("update_client_list", (clients) => {
        setClients(clients);
      });
    }

    // WebRTC signaling events
    newSocket.on("call_offer", async (data) => {
      if (inCall) {
        newSocket.emit("call_reject", { to: data.from });
        return;
      }
      setIncomingCall({ from: data.from, callType: data.callType, offer: data.offer });
      ringtoneAudio.loop = true;
      ringtoneAudio.play().catch((error) => console.error("Ringtone error:", error));
    });

    newSocket.on("call_answer", async (data) => {
      if (pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      }
    });

    newSocket.on("call_candidate", async (data) => {
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    newSocket.on("call_reject", (data) => {
      alert("Call rejected by the recipient.");
      endCall();
    });

    newSocket.on("call_end", (data) => {
      endCall();
    });

    setSocket(newSocket);
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    return () => {
      newSocket.disconnect();
    };
  }, [isAdmin, inCall, isChatOpen, isMinimized, clientId, endCall]);

  // Helper functions
  const getMediaConstraints = (type) =>
    type === "audio" ? { audio: true, video: false } : { audio: true, video: true };

  // Create a new RTCPeerConnection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call_candidate", { to: getCallPartnerId(), candidate: event.candidate });
      }
    };
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current && callType === "video") {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };
    pc.onconnectionstatechange = () => {
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        endCall();
      }
    };
    return pc;
  };

  // Initiate a call
  const initiateCall = async (type) => {
    if (isAdmin && !selectedClientId) {
      alert("Please select a client to call.");
      return;
    }
    try {
      const constraints = { audio: true, video: type === "video" };
      console.log("Requesting media with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints).catch(async (error) => {
        if (type === "video" && error.name === "NotFoundError") {
          console.warn("Camera not found, falling back to audio-only call.");
          return navigator.mediaDevices.getUserMedia({ audio: true });
        }
        throw error;
      });
      setLocalStream(stream);
      if (localVideoRef.current && type === "video") {
        localVideoRef.current.srcObject = stream;
      }
      pcRef.current = createPeerConnection();
      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socket.emit("call_offer", { to: getCallPartnerId(), callType: type, offer });
      setCallType(type);
      setInCall(true);
    } catch (error) {
      console.error("Error initiating call:", error);
      if (error.name === "NotFoundError") {
        alert("No microphone or camera found. Please check your devices.");
      } else if (error.name === "NotAllowedError") {
        alert("Permission denied for microphone or camera access.");
      } else {
        alert("Error initiating call. Please check your permissions (HTTPS required).");
      }
    }
  };

  // Accept an incoming call
  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
    try {
      const stream = await navigator.mediaDevices.getUserMedia(getMediaConstraints(incomingCall.callType));
      setLocalStream(stream);
      if (localVideoRef.current && incomingCall.callType === "video") {
        localVideoRef.current.srcObject = stream;
      }
      pcRef.current = createPeerConnection();
      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit("call_answer", { to: incomingCall.from, answer });
      setCallType(incomingCall.callType);
      setInCall(true);
      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
      alert("Error accepting call.");
    }
  };

  // Reject an incoming call
  const handleRejectCall = () => {
    if (incomingCall) {
      socket.emit("call_reject", { to: incomingCall.from });
      ringtoneAudio.pause();
      ringtoneAudio.currentTime = 0;
      setIncomingCall(null);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    try {
      await fetch("/api/messages/markAsRead", {
        method: "PUT",
        body: JSON.stringify({ userId: isAdmin ? selectedClientId : clientId }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [clientId, isAdmin, selectedClientId]);

  // Toggle chat window
  const handleChatToggle = useCallback(() => {
    setIsChatOpen((prev) => !prev);
    setIsMinimized(false);
    setUnreadCount(0);
    markMessagesAsRead();
  }, [markMessagesAsRead]);

  // Toggle minimize chat
  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) => !prev);
    if (!isMinimized) setUnreadCount(0);
  }, [isMinimized]);

  // Send a message
  const handleSendMessage = useCallback(() => {
    if (!message.trim()) {
      alert("Message is empty!");
      return;
    }
    if (isAdmin) {
      if (!selectedClientId) {
        alert("No client selected.");
        return;
      }
      socket.emit("send_message_to_client", { clientId: selectedClientId, message });
    } else {
      socket.emit("send_message_to_admin", { message });
    }
    setMessages((prev) => [...prev, { sender: isAdmin ? "admin" : "client", message }]);
    setMessage("");
  }, [message, socket, isAdmin, selectedClientId]);

  // Render client list (admin only)
  const renderClientList = () => (
    <select onChange={(e) => setSelectedClientId(e.target.value)} value={selectedClientId || ""} className="client-selector">
      <option value="">Select a client</option>
      {clients.length === 0 ? (
        <option disabled>No clients connected</option>
      ) : (
        clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))
      )}
    </select>
  );

  return (
    <div className="chat-app">
      {!isChatOpen ? (
        <>
          <p className="chat-info">Chat with us!</p>
          <button className="chat-bubble-icon" onClick={handleChatToggle}>
            💬 {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
          </button>
        </>
      ) : (
        <div className={`chat-container ${isMinimized ? "minimized" : ""}`}>
          <div className="chat-header">
            <h4>Chat {isAdmin ? "Admin" : "Client"}</h4>
            <div className="header-buttons">
              <div className="call-buttons-container">
                <button className="call-button audio" onClick={() => initiateCall("audio")}>📞</button>
                <button className="call-button video" onClick={() => initiateCall("video")}>📹</button>
              </div>
              <div className="chat-controls">
                <button className="minimize-button" onClick={handleMinimizeToggle}>{isMinimized ? "🗖" : "__"}</button>
                <button className="close-button" onClick={handleChatToggle}>X</button>
              </div>
            </div>
          </div>
          {!isMinimized && (
            <>
              {isAdmin && renderClientList()}
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender === (isAdmin ? "admin" : "client") ? "sender" : "receiver"}`}>
                    <span className="sender">{msg.sender} :</span>
                    <p>{msg.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      )}

      {inCall && (
        <div className="call-container">
          <h4>Ongoing Call ({callType === "audio" ? "Audio" : "Video"})</h4>
          {callType === "video" && (
            <div className="video-container">
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
              <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
            </div>
          )}
          {callType === "audio" && <p>Audio call in progress...</p>}
          <button onClick={endCall}>End Call</button>
        </div>
      )}

      {incomingCall && (
        <div className="incoming-call-modal">
          <p>
            Incoming call from {incomingCall.from} ({incomingCall.callType === "audio" ? "Audio" : "Video"})
          </p>
          <button onClick={handleAcceptCall}>Accept</button>
          <button onClick={handleRejectCall}>Reject</button>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ChatApp;