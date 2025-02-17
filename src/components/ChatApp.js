import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Setup ringtone and notification audio
const ringtoneURL = "/audio/ringtone.mp3";
const notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3");
const ringtoneAudio = new Audio(ringtoneURL);
ringtoneAudio.crossOrigin = "anonymous";

const SOCKET_SERVER_URL = "https://mobile-barbershop-backend.onrender.com";

// Media constraints for improved audio/video quality
const audioConstraints = {
  audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
};
const videoConstraints = {
  audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
  video: true
};

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
  const [callConnected, setCallConnected] = useState(false);
  const [callType, setCallType] = useState(null); // "audio" or "video"
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  // Refs for DOM elements and persistent values
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // Instead of display: none, we set minimal size so browsers allow playback
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  // Mirror state for use in event handlers
  const inCallRef = useRef(inCall);
  const selectedClientIdRef = useRef(selectedClientId);
  const callTypeRef = useRef(callType);
  useEffect(() => { inCallRef.current = inCall; }, [inCall]);
  useEffect(() => { selectedClientIdRef.current = selectedClientId; }, [selectedClientId]);
  useEffect(() => { callTypeRef.current = callType; }, [callType]);

  // Determine call partner ID (for admin, use the selected client)
  const getCallPartnerId = useCallback(() => {
    return isAdmin ? selectedClientIdRef.current : "admin";
  }, [isAdmin]);

  // Scroll to bottom when messages update
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // iOS Autoplay workaround: play and immediately pause ringtone to unlock audio context
  useEffect(() => {
    const enableAudio = () => {
      ringtoneAudio.play().then(() => {
        ringtoneAudio.pause();
        ringtoneAudio.currentTime = 0;
      }).catch(err => console.warn("Autoplay blocked:", err));
      document.removeEventListener("click", enableAudio);
    };
    document.addEventListener("click", enableAudio, { once: true });
  }, []);

  useEffect(() => { ringtoneAudio.load(); }, []);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Ringtone control functions
  const startRingtone = useCallback(() => {
    if (ringtoneAudio.paused) {
      ringtoneAudio.loop = true;
      ringtoneAudio.play().catch(err => console.error("Ringtone play error:", err));
    }
  }, []);
  const stopRingtone = useCallback(() => {
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
  }, []);

  useEffect(() => {
    if (incomingCall) {
      startRingtone();
    } else {
      stopRingtone();
    }
  }, [incomingCall, startRingtone, stopRingtone]);

  // End call: cleanup connection and streams, notify remote peer and display toast
  const endCall = useCallback(() => {
    console.log("Ending call...");
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteAudioRef.current.srcObject = null;
    }
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    setLocalStream(null);
    setInCall(false);
    setCallConnected(false);
    setCallType(null);
    stopRingtone();
    // Emit call_end so that remote peer also ends the call
    socketRef.current?.emit("call_end", { to: getCallPartnerId() });
    toast.info("Call has been ended.");
  }, [localStream, getCallPartnerId, stopRingtone]);

  // Establish Socket.IO connection and setup event listeners
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { auth: { token: localStorage.getItem("token") } });
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to signaling server.");
    });

    socket.on("new_message", (data) => {
      if (isAdmin || data.senderId !== clientId) {
        console.log("New message:", data);
        setMessages(prev => [...prev, { sender: data.sender, message: data.message }]);
        notificationAudio.play().catch(() => {});
        if (Notification.permission === "granted") {
          new Notification(`Message from ${data.sender}`, { body: data.message });
        }
        if (!isChatOpen || isMinimized) {
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    if (isAdmin) {
      socket.on("update_client_list", (clientList) => {
        console.log("Client list updated:", clientList);
        setClients(clientList);
      });
    }

    // WebRTC signaling events
    socket.on("call_offer", (data) => {
      console.log("Received call offer:", data);
      if (inCallRef.current) {
        socket.emit("call_reject", { to: data.from });
        return;
      }
      setIncomingCall(data);
    });

    socket.on("call_answer", async (data) => {
      if (pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log("Remote description set.");
          pendingCandidatesRef.current.forEach(candidate => {
            pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
              .catch(err => console.error("Error adding queued candidate:", err));
          });
          pendingCandidatesRef.current = [];
        } catch (error) {
          console.error("Error in call_answer:", error);
        }
      }
    });

    socket.on("call_candidate", async (data) => {
      if (pcRef.current) {
        if (pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            console.log("Added ICE candidate:", data.candidate);
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        } else {
          pendingCandidatesRef.current.push(data.candidate);
        }
      }
    });

    socket.on("call_reject", () => {
      toast.info("Call rejected by the recipient.");
      endCall();
    });

    socket.on("call_end", () => {
      toast.info("Call ended by remote party.");
      endCall();
    });

    // Modified disconnect handler: only call endCall() if a call is active.
    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
      if (inCallRef.current) {
        endCall();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAdmin, clientId, getCallPartnerId, endCall, isChatOpen, isMinimized]);

  // Call timer: update duration every second when call is connected
  const callTimerRef = useRef(null);
  useEffect(() => {
    if (inCall && callConnected) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [inCall, callConnected]);
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Create RTCPeerConnection and register event handlers
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
        socketRef.current?.emit("call_candidate", { to: getCallPartnerId(), candidate: event.candidate });
      }
    };
    pc.onconnectionstatechange = () => {
      console.log("Connection state changed:", pc.connectionState);
      if (pc.connectionState === "connected" || pc.connectionState === "completed") {
        setCallConnected(true);
      }
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        endCall();
      }
    };
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state changed:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        setCallConnected(true);
      }
      if (["disconnected", "failed", "closed"].includes(pc.iceConnectionState)) {
        endCall();
      }
    };
    pc.ontrack = (event) => {
      console.log("ontrack event:", event);
      if (event.track.kind === "audio" && remoteAudioRef.current) {
        let audioStream = remoteAudioRef.current.srcObject;
        if (!audioStream) {
          audioStream = new MediaStream();
          remoteAudioRef.current.srcObject = audioStream;
        }
        audioStream.addTrack(event.track);
        remoteAudioRef.current.volume = 1.0;
        remoteAudioRef.current.play().catch(err => console.error("Error playing remote audio:", err));
      } else if (event.track.kind === "video" && remoteVideoRef.current) {
        let videoStream = remoteVideoRef.current.srcObject;
        if (!videoStream) {
          videoStream = new MediaStream();
          remoteVideoRef.current.srcObject = videoStream;
        }
        videoStream.addTrack(event.track);
        remoteVideoRef.current.play().catch(err => console.error("Error playing remote video:", err));
      }
    };
    return pc;
  };

  // Initiate an outgoing call (audio or video)
  const initiateCall = async (type) => {
    if (isAdmin && !selectedClientId) {
      toast.error("Please select a client to call.");
      return;
    }
    try {
      const constraints = type === "audio" ? audioConstraints : videoConstraints;
      const stream = await navigator.mediaDevices.getUserMedia(constraints).catch(async (error) => {
        if (type === "video" && error.name === "NotFoundError") {
          toast.warn("Video device not found, falling back to audio-only call.");
          return await navigator.mediaDevices.getUserMedia(audioConstraints);
        }
        throw error;
      });
      setLocalStream(stream);
      if (localVideoRef.current && type === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(err => console.error("Local video play error:", err));
      }
      pcRef.current = createPeerConnection();
      stream.getTracks().forEach(track => {
        pcRef.current.addTrack(track, stream);
      });
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socketRef.current?.emit("call_offer", { to: getCallPartnerId(), callType: type, offer });
      setCallType(type);
      setInCall(true);
      console.log("Outgoing call initiated with offer:", offer);
    } catch (error) {
      console.error("Error initiating call:", error);
      if (error.name === "NotFoundError") {
        toast.error("No microphone or camera found. Please check your devices.");
      } else if (error.name === "NotAllowedError") {
        toast.error("Permission denied for microphone or camera access.");
      } else {
        toast.error("Error initiating call. Ensure you're using HTTPS and check your permissions.");
      }
    }
  };

  // Accept an incoming call
  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    stopRingtone();
    try {
      const constraints = incomingCall.callType === "audio" ? audioConstraints : videoConstraints;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current && incomingCall.callType === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(err => console.error("Local video play error:", err));
      }
      pcRef.current = createPeerConnection();
      stream.getTracks().forEach(track => {
        pcRef.current.addTrack(track, stream);
      });
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      pendingCandidatesRef.current.forEach(candidate => {
        pcRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(err =>
          console.error("Error adding queued candidate:", err)
        );
      });
      pendingCandidatesRef.current = [];
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socketRef.current?.emit("call_answer", { to: incomingCall.from, answer });
      setCallType(incomingCall.callType);
      setInCall(true);
      setIncomingCall(null);
      console.log("Call accepted. Answer sent:", answer);
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Error accepting call.");
    }
  };

  // Reject an incoming call
  const handleRejectCall = () => {
    if (incomingCall) {
      socketRef.current?.emit("call_reject", { to: incomingCall.from });
      stopRingtone();
      setIncomingCall(null);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    const targetUserId = isAdmin ? selectedClientId : clientId;
    if (!targetUserId) return;
    try {
      await fetch("/api/messages/markAsRead", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId }),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [clientId, isAdmin, selectedClientId]);

  // Toggle chat window open/close
  const handleChatToggle = useCallback(() => {
    setIsChatOpen(prev => !prev);
    setIsMinimized(false);
    setUnreadCount(0);
    markMessagesAsRead();
  }, [markMessagesAsRead]);

  // Toggle minimize chat
  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized(prev => !prev);
    if (!isMinimized) setUnreadCount(0);
  }, [isMinimized]);

  // Send a chat message
  const handleSendMessage = useCallback(() => {
    if (!message.trim()) {
      toast.error("Message is empty!");
      return;
    }
    if (isAdmin && !selectedClientId) {
      toast.error("No client selected.");
      return;
    }
    socketRef.current?.emit(
      isAdmin ? "send_message_to_client" : "send_message_to_admin",
      { clientId: selectedClientId, message }
    );
    setMessages(prev => [...prev, { sender: isAdmin ? "admin" : "client", message }]);
    setMessage("");
  }, [message, isAdmin, selectedClientId]);

  // Render client list (for admin)
  const renderClientList = () => (
    <select
      onChange={(e) => setSelectedClientId(e.target.value)}
      value={selectedClientId || ""}
      className="client-selector"
    >
      <option value="">Select a client</option>
      {clients.length === 0 ? (
        <option disabled>No clients connected</option>
      ) : (
        clients.map(client => (
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
                <button className="minimize-button" onClick={handleMinimizeToggle}>
                  {isMinimized ? "🗖" : "__"}
                </button>
                <button className="close-button" onClick={handleChatToggle}>X</button>
              </div>
            </div>
          </div>
          {!isMinimized && (
            <>
              {isAdmin && renderClientList()}
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className="message">
                    <span className="message-author">{msg.sender}:</span>
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
          {/* Minimal visible remote audio element to allow autoplay */}
          <audio ref={remoteAudioRef} autoPlay style={{ width: "1px", height: "1px", opacity: 0 }} />
          {callType === "audio" && (
            <div className="audio-container">
              <p>Audio call in progress...</p>
            </div>
          )}
          <div className="call-timer">Call Duration: {formatDuration(callDuration)}</div>
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
