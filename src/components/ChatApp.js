import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  // Minimally visible remote audio element so autoplay is allowed
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  // Mirror state values for event handlers
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // iOS Autoplay workaround: unlock audio context on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      ringtoneAudio.play().then(() => {
        ringtoneAudio.pause();
        ringtoneAudio.currentTime = 0;
      }).catch(err => console.warn("Autoplay blocked:", err));
    };
    document.addEventListener("click", enableAudio, { once: true });
    return () => {
      document.removeEventListener("click", enableAudio);
    };
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
    incomingCall ? startRingtone() : stopRingtone();
  }, [incomingCall, startRingtone, stopRingtone]);

  // Helper to stop media tracks
  const stopMediaTracks = useCallback((stream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  // End call: cleanup streams, close connection, emit "call_end", and show toast.
  const endCall = useCallback(() => {
    console.log("Ending call...");
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    stopMediaTracks(localStream);
    if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
      stopMediaTracks(remoteAudioRef.current.srcObject);
      remoteAudioRef.current.srcObject = null;
    }
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      stopMediaTracks(remoteVideoRef.current.srcObject);
      remoteVideoRef.current.srcObject = null;
    }
    setLocalStream(null);
    setInCall(false);
    setCallConnected(false);
    setCallType(null);
    stopRingtone();
    // Only emit if call was active
    if (inCallRef.current) {
      socketRef.current?.emit("call_end", { to: getCallPartnerId() });
      toast.info("Call has been ended.");
    }
  }, [localStream, getCallPartnerId, stopMediaTracks, stopRingtone]);

  // Socket.IO connection and event listeners
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { auth: { token: localStorage.getItem("token") } });
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("Connected to signaling server.");
    };

    const handleNewMessage = (data) => {
      // Prevent duplicate messages by checking if message already exists (this can be expanded with unique IDs)
      setMessages(prev => {
        const exists = prev.some(msg => msg.sender === data.sender && msg.message === data.message);
        if (!exists) {
          return [...prev, { sender: data.sender, message: data.message, id: Date.now() }];
        }
        return prev;
      });
      notificationAudio.play().catch(() => {});
      if (Notification.permission === "granted") {
        new Notification(`Message from ${data.sender}`, { body: data.message });
      }
      if (!isChatOpen || isMinimized) setUnreadCount(prev => prev + 1);
    };

    const handleUpdateClientList = (clientList) => {
      console.log("Client list updated:", clientList);
      setClients(clientList);
    };

    const handleCallOffer = (data) => {
      console.log("Received call offer:", data);
      if (inCallRef.current) {
        socket.emit("call_reject", { to: data.from });
        return;
      }
      setIncomingCall(data);
    };

    const handleCallAnswer = async (data) => {
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
    };

    const handleCallCandidate = async (data) => {
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
    };

    const handleCallReject = (data) => {
      console.log("Received call rejection:", data);
      toast.info("Call rejected by the recipient.");
      endCall();
    };

    const handleCallEnd = () => {
      console.log("Received call end event.");
      toast.info("Call ended by remote party.");
      endCall();
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected.");
      if (inCallRef.current) endCall();
    };

    socket.on("connect", handleConnect);
    socket.on("new_message", handleNewMessage);
    if (isAdmin) {
      socket.on("update_client_list", handleUpdateClientList);
    }
    socket.on("call_offer", handleCallOffer);
    socket.on("call_answer", handleCallAnswer);
    socket.on("call_candidate", handleCallCandidate);
    socket.on("call_reject", handleCallReject);
    socket.on("call_end", handleCallEnd);
    socket.on("disconnect", handleDisconnect);

    return () => {
      // Cleanup socket event listeners
      socket.off("connect", handleConnect);
      socket.off("new_message", handleNewMessage);
      if (isAdmin) {
        socket.off("update_client_list", handleUpdateClientList);
      }
      socket.off("call_offer", handleCallOffer);
      socket.off("call_answer", handleCallAnswer);
      socket.off("call_candidate", handleCallCandidate);
      socket.off("call_reject", handleCallReject);
      socket.off("call_end", handleCallEnd);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [isAdmin, clientId, getCallPartnerId, endCall, isChatOpen, isMinimized]);

  // Call timer: update call duration every second when call is connected
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

  const formatDuration = useCallback((duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Create RTCPeerConnection with robust ICE and ontrack handling
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
        socketRef.current?.emit("call_candidate", { to: getCallPartnerId(), candidate: event.candidate });
      }
    };
    const connectionStateHandler = () => {
      console.log("Connection state changed:", pc.connectionState);
      if (pc.connectionState === "connected" || pc.connectionState === "completed") {
        setCallConnected(true);
      }
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        endCall();
      }
    };
    pc.onconnectionstatechange = connectionStateHandler;
    pc.oniceconnectionstatechange = connectionStateHandler;
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
  }, [getCallPartnerId, endCall]);

  // Initiate an outgoing call (audio or video)
  const initiateCall = useCallback(async (type) => {
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
  }, [isAdmin, selectedClientId, createPeerConnection, getCallPartnerId]);

  // Accept an incoming call
  const handleAcceptCall = useCallback(async () => {
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
        pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(err => console.error("Error adding queued candidate:", err));
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
  }, [incomingCall, createPeerConnection, stopRingtone]);

  // Reject an incoming call and notify caller
  const handleRejectCall = useCallback(() => {
    if (incomingCall) {
      socketRef.current?.emit("call_reject", { to: incomingCall.from });
      stopRingtone();
      toast.info("You rejected the call.");
      setIncomingCall(null);
    }
  }, [incomingCall, stopRingtone]);

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
    // Construct message with a unique identifier (timestamp)
    const newMessage = { id: Date.now(), sender: isAdmin ? "admin" : "client", message };
    socketRef.current?.emit(
      isAdmin ? "send_message_to_client" : "send_message_to_admin",
      { clientId: selectedClientId, message: newMessage.message }
    );
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  }, [message, isAdmin, selectedClientId]);

  // Render client list (for admin)
  const renderClientList = useCallback(() => (
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
  ), [clients, selectedClientId]);

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
                {messages.map((msg) => (
                  <div key={msg.id} className="message">
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
          {/* Minimally visible remote audio element to allow autoplay */}
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
