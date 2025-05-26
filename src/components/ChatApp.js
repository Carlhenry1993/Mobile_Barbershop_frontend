import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Environment variables
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
const RINGTONE_PATH = process.env.NEXT_PUBLIC_RINGTONE_PATH || "/audio/ringtone.mp3";

// Audio setup
const notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3");
const ringtoneAudio = new Audio(RINGTONE_PATH);
ringtoneAudio.crossOrigin = "anonymous";

// Media constraints
const audioConstraints = { audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } };
const videoConstraints = { 
  audio: { ...audioConstraints.audio },
  video: { width: { ideal: 1280 }, height: { ideal: 720 } }
};

const ChatApp = ({ clientId, isAdmin }) => {
  // State management
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callType, setCallType] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  // Refs
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const callDurationIntervalRef = useRef(null);

  // Synchronized refs
  const inCallRef = useRef(inCall);
  const selectedClientIdRef = useRef(selectedClientId);
  const callTypeRef = useRef(callType);

  useEffect(() => { inCallRef.current = inCall; }, [inCall]);
  useEffect(() => { selectedClientIdRef.current = selectedClientId; }, [selectedClientId]);
  useEffect(() => { callTypeRef.current = callType; }, [callType]);

  // Utility functions
  const getCallPartnerId = useCallback(() => isAdmin ? selectedClientIdRef.current : "admin", [isAdmin]);
  const scrollToBottom = useCallback(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Audio initialization
  useEffect(() => {
    const unlockAudio = () => {
      ringtoneAudio.play()
        .then(() => {
          ringtoneAudio.pause();
          ringtoneAudio.currentTime = 0;
        })
        .catch(console.error);
    };

    document.addEventListener("click", unlockAudio, { once: true });
    return () => document.removeEventListener("click", unlockAudio);
  }, []);

  // Notification permissions
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().catch(console.error);
    }
  }, []);

  // Call duration timer
  useEffect(() => {
    if (callConnected) {
      callDurationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (callDurationIntervalRef.current) {
        clearInterval(callDurationIntervalRef.current);
        callDurationIntervalRef.current = null;
      }
    };
  }, [callConnected]);

  // Media handling
  const stopMediaTracks = useCallback(stream => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        stream.removeTrack(track);
      });
    }
  }, []);

  const endCall = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    stopMediaTracks(localStream);
    setLocalStream(null);
    
    [remoteAudioRef, remoteVideoRef].forEach(ref => {
      if (ref.current?.srcObject) {
        stopMediaTracks(ref.current.srcObject);
        ref.current.srcObject = null;
      }
    });

    setInCall(false);
    setCallConnected(false);
    setCallType(null);
    setCallDuration(0);
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;

    if (inCallRef.current) {
      socketRef.current?.emit("call_end", { to: getCallPartnerId() });
      toast.info("Call has been ended");
    }
  }, [localStream, getCallPartnerId, stopMediaTracks]);

  // WebSocket connection
  useEffect(() => {
    if (!SOCKET_SERVER_URL) {
      console.error("Missing NEXT_PUBLIC_SOCKET_SERVER_URL");
      return;
    }

    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 10000
    });

    const socket = socketRef.current;

    const socketHandlers = {
      connect: () => {
        setIsConnected(true);
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: true });
        }
      },
      disconnect: () => {
        setIsConnected(false);
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: false });
        }
        if (inCallRef.current) endCall();
      },
      new_message: data => handleNewMessage(data),
      update_client_list: list => isAdmin && setClients(list),
      admin_status: data => !isAdmin && setAdminOnline(data.online),
      call_offer: data => setIncomingCall(data),
      call_answer: async data => {
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          pendingCandidatesRef.current.forEach(c => pcRef.current.addIceCandidate(new RTCIceCandidate(c)));
          pendingCandidatesRef.current = [];
        }
      },
      call_candidate: async data => {
        if (pcRef.current) {
          if (pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else {
            pendingCandidatesRef.current.push(data.candidate);
          }
        }
      },
      call_reject: () => {
        toast.info("Call rejected");
        endCall();
      },
      call_end: () => {
        toast.info("Call ended");
        endCall();
      }
    };

    Object.entries(socketHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(socketHandlers).forEach(event => {
        socket.off(event);
      });
      socket.disconnect();
    };
  }, [isAdmin, clientId, endCall]);

  // Message handling
  const handleNewMessage = useCallback(data => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: data.sender,
      message: data.message
    }]);

    notificationAudio.play().catch(console.error);

    if (Notification.permission === "granted") {
      new Notification(`Message from ${data.sender}`, { body: data.message });
    }

    if (isAdmin) {
      if (selectedClientId !== data.senderId) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1
        }));
      }
    } else if (!isChatOpen || isMinimized) {
      setUnreadCount(prev => prev + 1);
    }
  }, [isAdmin, selectedClientId, isChatOpen, isMinimized]);

  // WebRTC configuration
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    pc.onicecandidate = e => {
      if (e.candidate) {
        socketRef.current?.emit("call_candidate", {
          to: getCallPartnerId(),
          candidate: e.candidate
        });
      }
    };

    const handleConnectionChange = () => {
      if (["connected", "completed"].includes(pc.connectionState)) {
        setCallConnected(true);
      }
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        endCall();
      }
    };

    pc.onconnectionstatechange = handleConnectionChange;
    pc.oniceconnectionstatechange = handleConnectionChange;

    pc.ontrack = e => {
      const mediaElement = e.track.kind === "audio" 
        ? remoteAudioRef.current 
        : remoteVideoRef.current;

      if (mediaElement) {
        const mediaStream = mediaElement.srcObject || new MediaStream();
        mediaStream.addTrack(e.track);
        mediaElement.srcObject = mediaStream;
        mediaElement.play().catch(console.error);
      }
    };

    return pc;
  }, [getCallPartnerId, endCall]);

  // Call management
  const initiateCall = useCallback(async type => {
    if (isAdmin && !selectedClientId) {
      toast.error("Select a client first");
      return;
    }

    try {
      const constraints = type === "video" ? videoConstraints : audioConstraints;
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
        .catch(async err => {
          if (type === "video" && err.name === "NotFoundError") {
            toast.warn("No camera available, switching to audio call");
            return navigator.mediaDevices.getUserMedia(audioConstraints);
          }
          throw err;
        });

      setLocalStream(stream);
      if (localVideoRef.current && type === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(console.error);
      }

      pcRef.current = createPeerConnection();
      stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socketRef.current?.emit("call_offer", {
        to: getCallPartnerId(),
        callType: type,
        offer
      });

      setCallType(type);
      setInCall(true);
    } catch (err) {
      console.error("Call initiation error:", err);
      toast.error(err.message || "Failed to start call");
    }
  }, [isAdmin, selectedClientId, createPeerConnection, getCallPartnerId]);

  const handleAcceptCall = useCallback(async () => {
    if (!incomingCall) return;

    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;

    try {
      const constraints = incomingCall.callType === "video" ? videoConstraints : audioConstraints;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setLocalStream(stream);
      if (localVideoRef.current && incomingCall.callType === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(console.error);
      }

      pcRef.current = createPeerConnection();
      stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );
      
      pendingCandidatesRef.current.forEach(c => 
        pcRef.current.addIceCandidate(new RTCIceCandidate(c))
      );
      pendingCandidatesRef.current = [];

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socketRef.current?.emit("call_answer", {
        to: incomingCall.from,
        answer
      });

      setCallType(incomingCall.callType);
      setInCall(true);
      setIncomingCall(null);
    } catch (err) {
      console.error("Call acceptance error:", err);
      toast.error("Failed to accept call");
    }
  }, [incomingCall, createPeerConnection]);

  const handleRejectCall = useCallback(() => {
    if (incomingCall) {
      socketRef.current?.emit("call_reject", { to: incomingCall.from });
      ringtoneAudio.pause();
      ringtoneAudio.currentTime = 0;
      setIncomingCall(null);
      toast.info("Call rejected");
    }
  }, [incomingCall]);

  // UI helpers
  const renderClientList = useCallback(() => (
    <select 
      value={selectedClientId || ""} 
      onChange={e => {
        setSelectedClientId(e.target.value);
        setUnreadCounts(prev => {
          const updated = { ...prev };
          delete updated[e.target.value];
          return updated;
        });
      }} 
      className="client-selector"
      aria-label="Select client"
    >
      <option value="">Select a client</option>
      {clients.length === 0 ? (
        <option disabled>No active clients</option>
      ) : clients.map(client => (
        <option key={client.id} value={client.id}>
          {client.name}
          {unreadCounts[client.id] ? ` (${unreadCounts[client.id]})` : ""}
        </option>
      ))}
    </select>
  ), [clients, selectedClientId, unreadCounts]);

  const handleChatToggle = useCallback(() => {
    setIsChatOpen(o => !o);
    setIsMinimized(false);
    
    if (!isAdmin) {
      setUnreadCount(0);
    } else if (selectedClientId) {
      setUnreadCounts(prev => {
        const updated = { ...prev };
        delete updated[selectedClientId];
        return updated;
      });
    }
  }, [isAdmin, selectedClientId]);

  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized(m => !m);
    if (!isAdmin && !isMinimized) setUnreadCount(0);
  }, [isMinimized, isAdmin]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return toast.error("Message cannot be empty");
    if (isAdmin && !selectedClientId) return toast.error("No client selected");

    const newMsg = { 
      id: Date.now(),
      sender: isAdmin ? "admin" : "client",
      message: message.trim()
    };

    socketRef.current?.emit(
      isAdmin ? "send_message_to_client" : "send_message_to_admin",
      { clientId: selectedClientId, message: message.trim() }
    );

    setMessages(prev => [...prev, newMsg]);
    setMessage("");
  }, [message, isAdmin, selectedClientId]);

  return (
    <div className="chat-app">
      {/* Admin status indicator */}
      {isAdmin && (
        <div className="status-indicator">
          <span>Status: {isConnected ? "🟢 Online" : "🔴 Offline"}</span>
        </div>
      )}

      {/* Chat interface */}
      {!isChatOpen ? (
        <div className="chat-closed-state">
          <p className="chat-info">Chat with us!</p>
          <button 
            onClick={handleChatToggle} 
            className="chat-bubble-icon"
            aria-label="Open chat"
          >
            💬
            {(isAdmin 
              ? Object.values(unreadCounts).reduce((a, b) => a + b, 0) 
              : unreadCount) > 0 && (
              <span className="unread-count">
                {isAdmin 
                  ? Object.values(unreadCounts).reduce((a, b) => a + b, 0) 
                  : unreadCount}
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className={`chat-container ${isMinimized ? "minimized" : ""}`}>
          <div className="chat-header">
            <h4>{isAdmin ? "Admin Panel" : "Customer Support"}</h4>
            {!isAdmin && (
              <div className="admin-status">
                Admin status: {adminOnline ? "🟢 Online" : "🔴 Offline"}
              </div>
            )}
            <div className="header-buttons">
              <div className="call-buttons-container">
                <button 
                  onClick={() => initiateCall("audio")} 
                  className="call-button audio"
                  aria-label="Start audio call"
                >
                  📞
                </button>
                <button
                  onClick={() => initiateCall("video")}
                  className="call-button video"
                  aria-label="Start video call"
                >
                  📹
                </button>
              </div>
              <div className="chat-controls">
                <button
                  onClick={handleMinimizeToggle}
                  className="minimize-button"
                  aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                >
                  {isMinimized ? "🗖" : "🗕"}
                </button>
                <button
                  onClick={handleChatToggle}
                  className="close-button"
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {isAdmin && renderClientList()}
              <div className={`chat-messages ${isAdmin ? "admin-view" : "client-view"}`}>
                {messages.map((m) => (
                  <div key={m.id} className={`message ${m.sender}`}>
                    <span className="message-author">{m.sender}:</span>
                    <p>{m.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="chat-input">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  aria-label="Type your message"
                />
                <button 
                  onClick={handleSendMessage}
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Call interfaces */}
      {inCall && (
        <div className="call-container">
          <h4>Ongoing {callType === "audio" ? "Audio" : "Video"} Call</h4>
          {callType === "video" && (
            <div className="video-container">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="remote-video"
                aria-label="Remote video"
              />
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="local-video"
                aria-label="Your video"
              />
            </div>
          )}
          <audio 
            ref={remoteAudioRef} 
            autoPlay 
            aria-hidden="true"
            style={{ width: 1, height: 1, opacity: 0 }}
          />
          {callType === "audio" && (
            <div className="audio-container">
              <p>🔊 Audio call in progress...</p>
            </div>
          )}
          <div className="call-timer">
            Duration: {`${Math.floor(callDuration / 60)
              .toString()
              .padStart(2, "0")}:${(callDuration % 60)
              .toString()
              .padStart(2, "0")}`}
          </div>
          <button 
            onClick={endCall}
            className="end-call-button"
            aria-label="End call"
          >
            End Call
          </button>
        </div>
      )}

      {incomingCall && (
        <div className="incoming-call-modal">
          <p>
            Incoming {incomingCall.callType} call from{" "}
            {incomingCall.from === "admin" ? "Support Agent" : "Client"}
          </p>
          <div className="call-buttons">
            <button 
              onClick={handleAcceptCall}
              className="accept-button"
            >
              Accept
            </button>
            <button 
              onClick={handleRejectCall}
              className="reject-button"
            >
              Reject
            </button>
          </div>
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