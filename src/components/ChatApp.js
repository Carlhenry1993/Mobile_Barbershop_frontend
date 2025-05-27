import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "Please refresh the page."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Audio setup with Supabase-hosted files
const createAudioElement = (src, options = {}) => {
  const audio = new Audio(src);
  audio.crossOrigin = "anonymous";
  audio.preload = "auto";
  if (options.loop) audio.loop = true;
  return audio;
};

const ringtoneURL = "https://your-supabase-project.storage.supabase.co/storage/v1/object/public/audio/ringtone.mp3";
const notificationAudio = createAudioElement("https://your-supabase-project.storage.supabase.co/storage/v1/object/public/audio/notification.mp3");
const ringtoneAudio = createAudioElement(ringtoneURL, { loop: true });

const SOCKET_SERVER_URL = "https://api.mrrenaudinbarbershop.com";

// Media constraints for improved audio/video quality
const audioConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
};
const videoConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
};

const ChatApp = ({ clientId, isAdmin }) => {
  // Chat states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Connection status states
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

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
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const reconnectTimeoutRef = useRef(null);

  // Mirror state values for event handlers
  const inCallRef = useRef(inCall);
  const selectedClientIdRef = useRef(selectedClientId);
  const callTypeRef = useRef(callType);
  useEffect(() => { inCallRef.current = inCall; }, [inCall]);
  useEffect(() => { selectedClientIdRef.current = selectedClientId; }, [selectedClientId]);
  useEffect(() => { callTypeRef.current = callType; }, [callType]);

  // Determine call partner ID
  const getCallPartnerId = useCallback(() => {
    return isAdmin ? selectedClientIdRef.current : "admin";
  }, [isAdmin]);

  // Scroll to bottom when messages update
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  // Initialize audio with error handling
  const initializeAudio = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
      }
      await Promise.all([
        new Promise((resolve, reject) => {
          ringtoneAudio.addEventListener("canplaythrough", resolve, { once: true });
          ringtoneAudio.addEventListener("error", reject, { once: true });
          ringtoneAudio.load();
        }),
        notificationAudio
          ? new Promise((resolve, reject) => {
              notificationAudio.addEventListener("canplaythrough", resolve, { once: true });
              notificationAudio.addEventListener("error", reject, { once: true });
              notificationAudio.load();
            })
          : Promise.resolve(),
      ]);
    } catch (error) {
      console.warn("Audio initialization warning:", error);
    }
  }, []);

  // iOS Autoplay workaround
  useEffect(() => {
    const enableAudio = async () => {
      try {
        await ringtoneAudio.play();
        await ringtoneAudio.pause();
        ringtoneAudio.currentTime = 0;
        await initializeAudio();
      } catch (error) {
        console.warn("Audio unlock failed:", error);
      }
    };
    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("touchend", enableAudio, { once: true });
    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchend", enableAudio);
    };
  }, [initializeAudio]);

  // Request notification permission
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.warn("Notification permission request failed:", error);
        }
      }
    };
    requestNotificationPermission();
  }, []);

  // Ringtone control functions
  const audioManager = useMemo(
    () => ({
      startRingtone: async () => {
        try {
          if (ringtoneAudio.paused) {
            ringtoneAudio.loop = true;
            await ringtoneAudio.play();
          }
        } catch (error) {
          console.error("Ringtone play error:", error);
        }
      },
      stopRingtone: () => {
        ringtoneAudio.pause();
        ringtoneAudio.currentTime = 0;
      },
      playNotification: async () => {
        if (!notificationAudio) return;
        try {
          notificationAudio.currentTime = 0;
          await notificationAudio.play();
        } catch (error) {
          console.warn("Notification sound failed:", error);
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (incomingCall) {
      audioManager.startRingtone();
    } else {
      audioManager.stopRingtone();
    }
  }, [incomingCall, audioManager]);

  // Helper to stop media tracks
  const stopMediaTracks = useCallback((stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
    }
  }, []);

  // End call with cleanup
  const endCall = useCallback(() => {
    console.log("Ending call...");
    try {
      audioManager.stopRingtone();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      stopMediaTracks(localStream);
      setLocalStream(null);
      if (remoteAudioRef.current?.srcObject) {
        stopMediaTracks(remoteAudioRef.current.srcObject);
        remoteAudioRef.current.srcObject = null;
      }
      if (remoteVideoRef.current?.srcObject) {
        stopMediaTracks(remoteVideoRef.current.srcObject);
        remoteVideoRef.current.srcObject = null;
      }
      if (localVideoRef.current?.srcObject) {
        stopMediaTracks(localVideoRef.current.srcObject);
        localVideoRef.current.srcObject = null;
      }
      setInCall(false);
      setCallConnected(false);
      setCallType(null);
      setIncomingCall(null);
      pendingCandidatesRef.current = [];
      if (inCallRef.current) {
        socketRef.current?.emit("call_end", { to: getCallPartnerId() });
        toast.info("Call has been ended.");
      }
    } catch (error) {
      console.error("Error during call cleanup:", error);
      toast.error("Error ending call.");
    }
  }, [localStream, getCallPartnerId, stopMediaTracks, audioManager]);

  // Fetch initial messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${SOCKET_SERVER_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMessages(data.map((msg) => ({
          id: msg.id,
          sender: msg.sender_id === clientId ? "client" : "admin",
          senderId: msg.sender_id,
          message: msg.message,
          timestamp: msg.timestamp,
        })));
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages.");
      }
    };
    fetchMessages();
  }, [clientId]);

  // Socket.IO connection with reconnection logic
  useEffect(() => {
    reconnectTimeoutRef.current = null;

    const connectSocket = () => {
      socketRef.current = io(SOCKET_SERVER_URL, {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket", "polling"],
        timeout: 10000,
        reconnection: false,
      });
      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected to signaling server:", SOCKET_SERVER_URL);
        setIsConnected(true);
        setReconnectAttempts(0);
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: true });
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: false });
        }
        if (inCallRef.current) endCall();
        if (reason !== "io client disconnect") {
          const attempts = reconnectAttempts + 1;
          setReconnectAttempts(attempts);
          const delay = Math.min(1000 * Math.pow(2, attempts) + Math.random() * 100, 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (attempts < 5) {
              connectSocket();
            } else {
              toast.error("Connection failed. Please refresh the page.");
            }
          }, delay);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        toast.error("Failed to connect to server.");
      });

      socket.on("new_message", (data) => {
        console.log("New message:", data);
        const newMessage = {
          id: Date.now() + Math.random(),
          sender: data.sender || "Unknown User",
          message: data.message,
          senderId: data.senderId,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        audioManager.playNotification();
        if (Notification.permission === "granted" && (!isChatOpen || isMinimized)) {
          const notification = new Notification(`Message from ${data.sender || "User"}`, {
            body: data.message,
            icon: "/favicon.ico",
          });
          notification.onclick = () => {
            window.focus();
            setIsChatOpen(true);
            setIsMinimized(false);
            setIsMaximized(false);
            notification.close();
          };
        }
        if (isAdmin) {
          if (selectedClientId !== data.senderId) {
            setUnreadCounts((prev) => ({
              ...prev,
              [data.senderId]: (prev[data.senderId] || 0) + 1,
            }));
          }
        } else {
          if (!isChatOpen || isMinimized) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      });

      if (isAdmin) {
        socket.on("update_client_list", (clientList) => {
          console.log("Client list updated:", clientList);
          setClients(clientList);
        });
      } else {
        socket.on("admin_status", (data) => {
          console.log("Received admin status:", data);
          setAdminOnline(data.online);
        });
      }

      socket.on("call_offer", (data) => {
        console.log("Received call offer:", data);
        if (!inCallRef.current) {
          setIncomingCall(data);
        } else {
          socket.emit("call_busy", { to: data.from });
        }
      });

      socket.on("call_answer", async (data) => {
        if (pcRef.current && inCallRef.current) {
          try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log("Remote description set.");
            for (const candidate of pendingCandidatesRef.current) {
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (err) {
                console.error("Error adding queued candidate:", err);
              }
            }
            pendingCandidatesRef.current = [];
          } catch (error) {
            console.error("Error in call_answer:", error);
            endCall();
          }
        }
      });

      socket.on("call_candidate", async (data) => {
        if (pcRef.current) {
          if (pcRef.current.remoteDescription?.type) {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log("Added ICE candidate");
            } catch (error) {
              console.error("Error adding ICE candidate:", error);
            }
          } else {
            pendingCandidatesRef.current.push(data.candidate);
          }
        }
      });

      socket.on("call_reject", () => {
        console.log("Call rejected");
        toast.info("Call rejected by the recipient.");
        endCall();
      });

      socket.on("call_busy", () => {
        console.log("Recipient is busy");
        toast.info("Recipient is currently busy.");
        endCall();
      });

      socket.on("call_end", () => {
        console.log("Call ended by remote party");
        toast.info("Call ended by remote party.");
        endCall();
      });
    };

    connectSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAdmin, clientId, selectedClientId, endCall, isChatOpen, isMinimized, audioManager, reconnectAttempts, getCallPartnerId]);

  // Call timer
  const callTimerRef = useRef(null);
  useEffect(() => {
    if (inCall && callConnected) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
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

  // Create RTCPeerConnection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated");
        socketRef.current?.emit("call_candidate", {
          to: getCallPartnerId(),
          candidate: event.candidate,
        });
      }
    };
    pc.onconnectionstatechange = () => {
      console.log("WebRTC connection state:", pc.connectionState);
      if (["connected", "completed"].includes(pc.connectionState)) {
        setCallConnected(true);
      }
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        endCall();
      }
    };
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        toast.error("Failed to establish a stable connection.");
        endCall();
      }
    };
    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      let stream = event.streams[0] || new MediaStream();
      if (event.track.kind === "audio" && remoteAudioRef.current) {
        stream.addTrack(event.track);
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch((err) => console.error("Error playing remote audio:", err));
      } else if (event.track.kind === "video" && remoteVideoRef.current) {
        stream.addTrack(event.track);
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch((err) => console.error("Error playing remote video:", err));
      }
    };
    return pc;
  }, [getCallPartnerId, endCall]);

  // Initiate an outgoing call
  const initiateCall = useCallback(
    async (type) => {
      if (isAdmin && !selectedClientId) {
        toast.error("Please select a client to call.");
        return;
      }
      if (!isConnected) {
        toast.error("Not connected to server.");
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
          localVideoRef.current.play().catch((err) => console.error("Local video play error:", err));
        }
        pcRef.current = createPeerConnection();
        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
        });
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socketRef.current?.emit("call_offer", {
          to: getCallPartnerId(),
          callType: type,
          offer,
        });
        setCallType(type);
        setInCall(true);
        setTimeout(() => {
          if (inCallRef.current && !callConnected) {
            toast.info("Call timeout - recipient didn't answer");
            endCall();
          }
        }, 30000);
      } catch (error) {
        console.error("Error initiating call:", error);
        const errorMessages = {
          NotFoundError: "No microphone or camera found.",
          NotAllowedError: "Permission denied for microphone or camera.",
          NotReadableError: "Camera or microphone is in use.",
        };
        toast.error(errorMessages[error.name] || "Error starting call.");
      }
    },
    [isAdmin, selectedClientId, isConnected, createPeerConnection, getCallPartnerId, callConnected, endCall]
  );

  // Accept an incoming call
  const handleAcceptCall = useCallback(async () => {
    if (!incomingCall) return;
    audioManager.stopRingtone();
    try {
      const constraints = incomingCall.callType === "audio" ? audioConstraints : videoConstraints;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current && incomingCall.callType === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch((err) => console.error("Local video play error:", err));
      }
      pcRef.current = createPeerConnection();
      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      for (const candidate of pendingCandidatesRef.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding queued candidate:", err);
        }
      }
      pendingCandidatesRef.current = [];
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socketRef.current?.emit("call_answer", {
        to: incomingCall.from,
        answer,
      });
      setCallType(incomingCall.callType);
      setInCall(true);
      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Error accepting call.");
      endCall();
    }
  }, [incomingCall, createPeerConnection, audioManager, endCall]);

  // Reject an incoming call
  const handleRejectCall = useCallback(() => {
    if (incomingCall) {
      socketRef.current?.emit("call_reject", { to: incomingCall.from });
      audioManager.stopRingtone();
      toast.info("You rejected the call.");
      setIncomingCall(null);
    }
  }, [incomingCall, audioManager]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    const targetUserId = isAdmin ? selectedClientId : clientId;
    if (!targetUserId) return;
    try {
      const response = await fetch(`${SOCKET_SERVER_URL}/api/messages/markAsRead`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: targetUserId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [clientId, isAdmin, selectedClientId]);

  // Toggle chat window
  const handleChatToggle = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("Chat toggle clicked", {
        isChatOpen: !isChatOpen,
        eventTarget: event.target.tagName,
        eventCurrentTarget: event.currentTarget.tagName,
        eventType: event.type,
      });
      setIsChatOpen((prev) => !prev);
      setIsMinimized(false);
      setIsMaximized(false);
      if (!isAdmin) {
        setUnreadCount(0);
      } else if (isAdmin && selectedClientId) {
        setUnreadCounts((prev) => {
          const updated = { ...prev };
          delete updated[selectedClientId];
          return updated;
        });
      }
      markMessagesAsRead();
    },
    [isChatOpen, isAdmin, selectedClientId, markMessagesAsRead]
  );

  // Toggle minimize chat
  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) => !prev);
    setIsMaximized(false); // Reset maximize state when minimizing
    if (!isMinimized && !isAdmin) {
      setUnreadCount(0);
      markMessagesAsRead();
    }
  }, [isMinimized, isAdmin, markMessagesAsRead]);

  // Toggle maximize/restore chat
  const handleMaximizeToggle = useCallback(() => {
    setIsMaximized((prev) => !prev);
    setIsMinimized(false); // Ensure not minimized when toggling maximize
  }, []);

  // Send a chat message
  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Message cannot be empty!");
      return;
    }
    if (isAdmin && !selectedClientId) {
      toast.error("No client selected.");
      return;
    }
    if (!isConnected) {
      toast.error("Not connected to server.");
      return;
    }
    const newMessage = {
      id: Date.now() + Math.random(),
      sender: isAdmin ? "admin" : "client",
      message: trimmedMessage,
      status: "sending",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    try {
      socketRef.current?.emit(
        isAdmin ? "send_message_to_client" : "send_message_to_admin",
        { clientId: selectedClientId, message: trimmedMessage }
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "failed" } : msg
        )
      );
      toast.error("Failed to send message.");
    }
  }, [message, isAdmin, selectedClientId, isConnected]);

  // Render client list
  const renderClientList = useCallback(
    () => (
      <select
        onChange={(e) => {
          const clientId = e.target.value;
          setSelectedClientId(clientId);
          if (clientId) {
            setUnreadCounts((prev) => {
              const updated = { ...prev };
              delete updated[clientId];
              return updated;
            });
            markMessagesAsRead();
          }
        }}
        value={selectedClientId || ""}
        className="client-selector"
        disabled={!isConnected}
        aria-label="Select a client to chat with"
      >
        <option value="">Select a client</option>
        {clients.length === 0 ? (
          <option disabled>No clients connected</option>
        ) : (
          clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name || "Unknown Client"}
              {unreadCounts[client.id] ? ` (${unreadCounts[client.id]})` : ""}
              {client.online ? " 🟢" : " 🔴"}
            </option>
          ))
        )}
      </select>
    ),
    [clients, selectedClientId, unreadCounts, isConnected, markMessagesAsRead]
  );

  // Render messages with timestamps
  const renderMessages = useMemo(() => {
    try {
      return (
        <div className={`chat-messages ${isAdmin ? "admin-view" : "client-view"}`} aria-live="polite">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender} ${msg.status || ""}`}>
                <span className="message-author">{msg.sender || "Unknown User"}:</span>
                <p>{msg.message}</p>
                <span className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {msg.status && (
                  <div className="message-status">
                    {msg.status === "sending" && "⏳"}
                    {msg.status === "sent" && "✓"}
                    {msg.status === "failed" && "❌"}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      );
    } catch (error) {
      console.error("Render messages error:", error);
      return <div>Error rendering messages. Please refresh.</div>;
    }
  }, [messages, isAdmin]);

  // Calculate total unread messages
  const totalUnreadMessages = isAdmin
    ? Object.values(unreadCounts).reduce((a, b) => a + b, 0)
    : unreadCount;

  return (
    <ErrorBoundary>
      <div className="chat-app">
        {isAdmin && (
          <div className="status-indicator">
            <span>
              You are {isConnected ? "Online 🟢" : "Offline 🔴"}
              {reconnectAttempts > 0 && ` (Reconnecting: ${reconnectAttempts}/5)`}
            </span>
          </div>
        )}
        {!isChatOpen ? (
          <div className="chat-bubble-container">
            <p className="chat-info">Chat with us!</p>
            {!isAdmin && !adminOnline && (
              <p className="admin-offline-notice">Admin is currently offline</p>
            )}
            <button
              type="button"
              className="chat-bubble-icon"
              onClick={handleChatToggle}
              disabled={!isConnected}
              title={isConnected ? "Open chat" : "Connecting..."}
              aria-label={isConnected ? "Open chat window" : "Chat is connecting"}
              aria-expanded={isChatOpen}
            >
              💬
              {totalUnreadMessages > 0 && (
                <span className="unread-count" aria-label={`${totalUnreadMessages} unread messages`}>
                  {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className={`chat-container ${isMinimized ? "minimized" : ""} ${isMaximized ? "maximized" : ""}`}>
            {isMinimized && <h4>Chat {isAdmin ? "Admin" : "Client"}</h4>}
            {!isMinimized && (
              <>
                <div className="chat-header">
                  <div>
                    <h4>Chat {isAdmin ? "Admin" : "Client"}</h4>
                    {!isAdmin && (
                      <div className="admin-status">
                        Admin is {adminOnline ? "Online 🟢" : "Offline 🔴"}
                      </div>
                    )}
                  </div>
                  <div className="header-buttons">
                    <div className="call-buttons-container">
                      <button
                        className="call-button audio"
                        onClick={() => initiateCall("audio")}
                        disabled={inCall || !isConnected || (isAdmin && !selectedClientId)}
                        title="Start audio call"
                        aria-label="Start audio call"
                      >
                        📞
                      </button>
                      <button
                        className="call-button video"
                        onClick={() => initiateCall("video")}
                        disabled={inCall || !isConnected || (isAdmin && !selectedClientId)}
                        title="Start video call"
                        aria-label="Start video call"
                      >
                        📹
                      </button>
                    </div>
                    <div className="chat-controls">
                      <button
                        className="minimize-button"
                        onClick={handleMinimizeToggle}
                        title={isMinimized ? "Restore" : "Minimize"}
                        aria-label={isMinimized ? "Restore chat" : "Minimize chat"}
                      >
                        _
                      </button>
                      <button
                        className="maximize-button"
                        onClick={handleMaximizeToggle}
                        title={isMaximized ? "Restore" : "Maximize"}
                        aria-label={isMaximized ? "Restore chat" : "Maximize chat"}
                      >
                        {isMaximized ? "🗗" : "🗖"}
                      </button>
                      <button
                        className="close-button"
                        onClick={handleChatToggle}
                        title="Close chat"
                        aria-label="Close chat"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
                {isAdmin && renderClientList()}
                {renderMessages}
                <div className="chat-input">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    maxLength={1000}
                    disabled={!isConnected || (isAdmin && !selectedClientId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    aria-label="Message input"
                    aria-describedby="chat-input-instructions"
                  />
                  <span id="chat-input-instructions" className="sr-only">
                    Type your message and press Enter to send. Shift + Enter for a new line.
                  </span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !isConnected || (isAdmin && !selectedClientId)}
                    aria-label="Send message"
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {inCall && (
          <div className="call-container">
            <h4>
              {callConnected
                ? `${callType === "audio" ? "Audio" : "Video"} Call`
                : "Connecting..."}
            </h4>
            {callType === "video" && (
              <div className="video-container">
                <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
                <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
              </div>
            )}
            <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />
            {callType === "audio" && (
              <div className="audio-container">
                <p>Audio call in progress...</p>
              </div>
            )}
            <div className="call-timer">Call Duration: {formatDuration(callDuration)}</div>
            <div className="call-controls">
              <button
                onClick={() => {
                  if (localStream) {
                    localStream.getAudioTracks().forEach((track) => {
                      track.enabled = !track.enabled;
                    });
                    toast.info(localStream.getAudioTracks()[0].enabled ? "Microphone unmuted" : "Microphone muted");
                  }
                }}
                aria-label={localStream?.getAudioTracks()[0]?.enabled ? "Mute microphone" : "Unmute microphone"}
              >
                {localStream?.getAudioTracks()[0]?.enabled ? "Mute" : "Unmute"}
              </button>
              <button onClick={endCall} aria-label="End call">End Call</button>
            </div>
          </div>
        )}

        {incomingCall && (
          <div className="incoming-call-modal">
            <p>
              Incoming {incomingCall.callType === "audio" ? "Audio" : "Video"} Call from{" "}
              {incomingCall.from || "Unknown User"}
            </p>
            <button onClick={handleAcceptCall} aria-label="Accept incoming call">Accept</button>
            <button onClick={handleRejectCall} aria-label="Reject incoming call">Reject</button>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </ErrorBoundary>
  );
};

export default ChatApp;