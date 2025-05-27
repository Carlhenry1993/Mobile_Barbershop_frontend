import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

// Audio setup with better error handling
const createAudioElement = (src, options = {}) => {
  const audio = new Audio(src);
  audio.crossOrigin = "anonymous";
  audio.preload = "auto";
  if (options.loop) audio.loop = true;
  return audio;
};

const ringtoneURL = "/audio/ringtone.mp3";
const notificationAudio = createAudioElement("https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3");
const ringtoneAudio = createAudioElement(ringtoneURL, { loop: true });

const SOCKET_URL = process.env.REACT_APP_SOCKET_SERVER_URL || "https://api.mrrenaudinbarbershop.com";

// Enhanced media constraints with fallback options
const MEDIA_CONSTRAINTS = {
  audio: {
    ideal: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100,
      channelCount: 1
    },
    fallback: {
      echoCancellation: true,
      noiseSuppression: true
    }
  },
  video: {
    ideal: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: "user"
    },
    fallback: {
      width: { ideal: 640, max: 1280 },
      height: { ideal: 480, max: 720 },
      frameRate: { ideal: 15, max: 30 }
    }
  }
};

// Enhanced ICE server configuration
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" }
];

// Connection states enum
const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
};

// Call states enum
const CALL_STATES = {
  IDLE: 'idle',
  CALLING: 'calling',
  RINGING: 'ringing',
  CONNECTED: 'connected',
  ENDING: 'ending'
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

  // Enhanced connection states
  const [connectionState, setConnectionState] = useState(CONNECTION_STATES.DISCONNECTED);
  const [adminOnline, setAdminOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Enhanced call states
  const [callState, setCallState] = useState(CALL_STATES.IDLE);
  const [callType, setCallType] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callQuality, setCallQuality] = useState('good');

  // Media states
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const callTimerRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const messageInputRef = useRef(null);

  // State refs for event handlers
  const stateRefs = useRef({});
  useEffect(() => {
    stateRefs.current = {
      callState,
      selectedClientId,
      callType,
      connectionState,
      isAdmin,
      clientId
    };
  }, [callState, selectedClientId, callType, connectionState, isAdmin, clientId]);

  // Memoized values
  const isConnected = useMemo(() => connectionState === CONNECTION_STATES.CONNECTED, [connectionState]);
  const inCall = useMemo(() => [CALL_STATES.CALLING, CALL_STATES.RINGING, CALL_STATES.CONNECTED].includes(callState), [callState]);
  const callConnected = useMemo(() => callState === CALL_STATES.CONNECTED, [callState]);
  const memoizedMessages = useMemo(() => messages, [messages]);

  const getCallPartnerId = useCallback(() => {
    return isAdmin ? stateRefs.current.selectedClientId : "admin";
  }, [isAdmin]);

  // Load persisted messages and selected client
  useEffect(() => {
    const savedMessages = localStorage.getItem(`messages_${selectedClientId || clientId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    const savedClientId = localStorage.getItem("selectedClientId");
    if (savedClientId && clients.some(c => c.id === savedClientId)) {
      setSelectedClientId(savedClientId);
    }
  }, [clients, selectedClientId, clientId]);

  useEffect(() => {
    if (memoizedMessages.length > 0) {
      localStorage.setItem(`messages_${selectedClientId || clientId}`, JSON.stringify(memoizedMessages));
    }
  }, [memoizedMessages, selectedClientId, clientId]);

  useEffect(() => {
    if (selectedClientId) {
      localStorage.setItem("selectedClientId", selectedClientId);
    }
  }, [selectedClientId]);

  // Global error handler
  useEffect(() => {
    const errorHandler = (event) => {
      console.error("Uncaught error:", event.error);
      toast.error("An unexpected error occurred. Please refresh the page.");
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  // Enhanced scroll to bottom with smooth behavior
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [memoizedMessages, scrollToBottom]);

  // Enhanced audio initialization with better iOS support
  const initializeAudio = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
      }
      await Promise.all([
        new Promise((resolve) => {
          ringtoneAudio.addEventListener('canplaythrough', resolve, { once: true });
          ringtoneAudio.load();
        }),
        new Promise((resolve) => {
          notificationAudio.addEventListener('canplaythrough', resolve, { once: true });
          notificationAudio.load();
        })
      ]);
    } catch (error) {
      console.warn("Audio initialization warning:", error);
    }
  }, []);

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

  // Enhanced notification permissions
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

  // Enhanced ringtone management
  const audioManager = useMemo(() => ({
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
      try {
        notificationAudio.currentTime = 0;
        await notificationAudio.play();
      } catch (error) {
        console.warn("Notification sound failed:", error);
      }
    }
  }), []);

  useEffect(() => {
    if (incomingCall) {
      audioManager.startRingtone();
    } else {
      audioManager.stopRingtone();
    }
  }, [incomingCall, audioManager]);

  // Enhanced media stream management
  const mediaManager = useMemo(() => ({
    async getUserMedia(constraints) {
      try {
        return await Promise.race([
          navigator.mediaDevices.getUserMedia(constraints.ideal),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Media permission timeout")), 10000))
        ]);
      } catch (error) {
        console.warn("Ideal constraints failed, trying fallback:", error);
        try {
          return await Promise.race([
            navigator.mediaDevices.getUserMedia(constraints.fallback),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Media permission timeout")), 10000))
          ]);
        } catch (fallbackError) {
          console.error("All media constraints failed:", fallbackError);
          throw fallbackError;
        }
      }
    },
    stopAllTracks(stream) {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped ${track.kind} track`);
        });
      }
    },
    toggleAudio(stream, muted) {
      if (stream) {
        stream.getAudioTracks().forEach(track => {
          track.enabled = !muted;
          console.log(`Audio track ${muted ? 'muted' : 'unmuted'}`);
        });
      }
    },
    toggleVideo(stream, muted) {
      if (stream) {
        stream.getVideoTracks().forEach(track => {
          track.enabled = !muted;
          console.log(`Video track ${muted ? 'muted' : 'unmuted'}`);
        });
      }
    }
  }), []);

  // Enhanced call ending with proper cleanup
  const endCall = useCallback(async () => {
    console.log("Ending call...");
    
    setCallState(CALL_STATES.ENDING);
    
    try {
      audioManager.stopRingtone();
      
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      
      mediaManager.stopAllTracks(localStream);
      
      if (remoteAudioRef.current?.srcObject) {
        mediaManager.stopAllTracks(remoteAudioRef.current.srcObject);
        remoteAudioRef.current.srcObject = null;
      }
      
      if (remoteVideoRef.current?.srcObject) {
        mediaManager.stopAllTracks(remoteVideoRef.current.srcObject);
        remoteVideoRef.current.srcObject = null;
      }
      
      setLocalStream(null);
      setRemoteStream(null);
      setCallType(null);
      setIsAudioMuted(false);
      setIsVideoMuted(false);
      setIsSpeakerOn(false);
      setIsMediaLoading(false);
      
      if ([CALL_STATES.CALLING, CALL_STATES.RINGING, CALL_STATES.CONNECTED].includes(stateRefs.current.callState)) {
        socketRef.current?.emit("call_end", { to: getCallPartnerId() });
        toast.info("Call has been ended.");
      }
    } catch (error) {
      console.error("Error during call cleanup:", error);
      toast.error("Error ending call. Please try again.");
    } finally {
      setCallState(CALL_STATES.IDLE);
    }
  }, [localStream, getCallPartnerId, mediaManager, audioManager]);

  // Enhanced socket connection with reconnection logic
  useEffect(() => {
    reconnectTimeoutRef.current = null;

    const connectSocket = () => {
      setConnectionState(CONNECTION_STATES.CONNECTING);

      socketRef.current = io(SOCKET_URL, {
        auth: { token: localStorage.getItem("token") },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Socket connected successfully to", SOCKET_URL);
        setConnectionState(CONNECTION_STATES.CONNECTED);
        setReconnectAttempts(0);
        
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: true });
        }
      });

      socket.on("disconnect", (reason) => {
        setConnectionState(CONNECTION_STATES.DISCONNECTED);
        console.log("Socket disconnected:", reason);
        
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: false });
        }
        
        if (stateRefs.current.callState !== CALL_STATES.IDLE) {
          endCall();
        }
        
        if (reason !== 'io client disconnect') {
          setConnectionState(CONNECTION_STATES.RECONNECTING);
          const attempts = reconnectAttempts + 1;
          setReconnectAttempts(attempts);
          
          const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (attempts < 5) {
              connectSocket();
            } else {
              setConnectionState(CONNECTION_STATES.ERROR);
              toast.error("Connection failed. Please refresh the page.");
            }
          }, delay);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setConnectionState(CONNECTION_STATES.ERROR);
        toast.error("Failed to connect to server. Please check your network or try again later.");
      });

      socket.on("new_message", (data) => {
        console.log("New message:", data);
        
        const newMessage = {
          id: Date.now() + Math.random(),
          sender: data.sender || "Unknown User",
          message: data.message,
          timestamp: new Date(),
          senderId: data.senderId
        };
        
        setMessages(prev => [...prev, newMessage]);
        audioManager.playNotification();
        
        if (Notification.permission === "granted" && (!isChatOpen || isMinimized)) {
          const notification = new Notification(`Message from ${data.sender || "User"}`, {
            body: data.message,
            icon: '/favicon.ico',
            tag: 'chat-message'
          });
          
          notification.onclick = () => {
            window.focus();
            setIsChatOpen(true);
            setIsMinimized(false);
            notification.close();
          };
          
          setTimeout(() => notification.close(), 5000);
        }
        
        if (isAdmin) {
          if (selectedClientId !== data.senderId) {
            setUnreadCounts(prev => ({
              ...prev,
              [data.senderId]: (prev[data.senderId] || 0) + 1,
            }));
          }
        } else {
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
      } else {
        socket.on("admin_status", (data) => {
          console.log("Received admin status:", data);
          setAdminOnline(data.online);
          setLastSeen(data.lastSeen);
        });
      }

      socket.on("call_offer", (data) => {
        console.log("Received call offer:", data);
        if (stateRefs.current.callState === CALL_STATES.IDLE) {
          setIncomingCall(data);
          setCallState(CALL_STATES.RINGING);
        } else {
          socket.emit("call_busy", { to: data.from });
        }
      });

      socket.on("call_answer", async (data) => {
        if (pcRef.current && stateRefs.current.callState === CALL_STATES.CALLING) {
          try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log("Remote description set.");
            
            while (pendingCandidatesRef.current.length > 0) {
              const candidate = pendingCandidatesRef.current.shift();
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (err) {
                console.error("Error adding queued candidate:", err);
              }
            }
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

  // Enhanced call timer
  useEffect(() => {
    if (callConnected) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callConnected]);

  // Enhanced duration formatting
  const formatDuration = useCallback((duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Enhanced peer connection creation
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceCandidatePoolSize: 10,
      bundlePolicy: 'balanced',
      rtcpMuxPolicy: 'require'
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated");
        socketRef.current?.emit("call_candidate", {
          to: getCallPartnerId(),
          candidate: event.candidate
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("WebRTC connection state:", pc.connectionState, "ICE state:", pc.iceConnectionState);
      
      switch (pc.connectionState) {
        case "connected":
          setCallState(CALL_STATES.CONNECTED);
          setCallQuality('good');
          break;
        case "disconnected":
        case "failed":
        case "closed":
          if (stateRefs.current.callState !== CALL_STATES.ENDING) {
            endCall();
          }
          break;
        default:
          break;
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed') {
        toast.error("Failed to establish a stable connection. Please check your network.");
        endCall();
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
      
      if (event.track.kind === "audio" && remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.volume = isSpeakerOn ? 1.0 : 0.8;
        remoteAudioRef.current.play().catch(err => 
          console.error("Error playing remote audio:", err)
        );
      }
      
      if (event.track.kind === "video" && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream || new MediaStream();
        remoteVideoRef.current.play().catch(err => 
          console.error("Error playing remote video:", err)
        );
      }
    };

    const statsInterval = setInterval(async () => {
      if (pc.connectionState === 'connected') {
        try {
          const stats = await pc.getStats();
          let packetsLost = 0;
          let packetsReceived = 0;
          
          stats.forEach(report => {
            if (report.type === 'inbound-rtp') {
              packetsLost += report.packetsLost || 0;
              packetsReceived += report.packetsReceived || 0;
            }
          });
          
          const lossRate = packetsReceived > 0 ? packetsLost / packetsReceived : 0;
          setCallQuality(lossRate < 0.05 ? 'good' : lossRate < 0.1 ? 'fair' : 'poor');
        } catch (error) {
          console.warn("Stats monitoring error:", error);
        }
      }
    }, 10000);

    pc.addEventListener('connectionstatechange', () => {
      if (['closed', 'failed'].includes(pc.connectionState)) {
        clearInterval(statsInterval);
      }
    });

    return pc;
  }, [getCallPartnerId, endCall, isSpeakerOn]);

  // Enhanced call initiation
  const initiateCall = useCallback(async (type) => {
    if (isAdmin && !selectedClientId) {
      toast.error("Please select a client to call.");
      return;
    }

    if (!isConnected) {
      toast.error("Not connected to server. Please wait and try again.");
      return;
    }

    setCallState(CALL_STATES.CALLING);
    setIsMediaLoading(true);

    try {
      const constraints = {
        audio: MEDIA_CONSTRAINTS.audio,
        video: type === "video" ? MEDIA_CONSTRAINTS.video : false
      };

      const stream = await mediaManager.getUserMedia(constraints);
      setLocalStream(stream);
      
      if (localVideoRef.current && type === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(err => 
          console.error("Local video play error:", err)
        );
      }
      
      pcRef.current = createPeerConnection();
      
      stream.getTracks().forEach(track => {
        pcRef.current.addTrack(track, stream);
      });
      
      const offer = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: type === "video"
      });
      
      await pcRef.current.setLocalDescription(offer);
      
      socketRef.current?.emit("call_offer", {
        to: getCallPartnerId(),
        callType: type,
        offer
      });
      
      setCallType(type);
      console.log("Call initiated successfully");
      
      setTimeout(() => {
        if (stateRefs.current.callState === CALL_STATES.CALLING) {
          toast.info("Call timeout - recipient didn't answer");
          endCall();
        }
      }, 30000);
      
    } catch (error) {
      console.error("Error initiating call:", error);
      setCallState(CALL_STATES.IDLE);
      setIsMediaLoading(false);
      const errorMessages = {
        'NotFoundError': "No microphone or camera found. Please check your devices.",
        'NotAllowedError': "Permission denied for microphone or camera access.",
        'NotReadableError': "Your camera or microphone is being used by another application.",
        'OverconstrainedError': "Camera or microphone doesn't meet the requirements."
      };
      toast.error(errorMessages[error.name] || "Error starting call. Please try again.");
    }
  }, [isAdmin, selectedClientId, isConnected, mediaManager, createPeerConnection, getCallPartnerId, endCall]);

  // Enhanced call acceptance
  const handleAcceptCall = useCallback(async () => {
    if (!incomingCall) return;
    
    audioManager.stopRingtone();
    setCallState(CALL_STATES.CALLING);
    setIsMediaLoading(true);
    
    try {
      const constraints = {
        audio: MEDIA_CONSTRAINTS.audio,
        video: incomingCall.callType === "video" ? MEDIA_CONSTRAINTS.video : false
      };
      
      const stream = await mediaManager.getUserMedia(constraints);
      setLocalStream(stream);
      
      if (localVideoRef.current && incomingCall.callType === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(err => 
          console.error("Local video play error:", err)
        );
      }
      
      pcRef.current = createPeerConnection();
      
      stream.getTracks().forEach(track => {
        pcRef.current.addTrack(track, stream);
      });
      
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      
      while (pendingCandidatesRef.current.length > 0) {
        const candidate = pendingCandidatesRef.current.shift();
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding queued candidate:", err);
        }
      }
      
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      
      socketRef.current?.emit("call_answer", {
        to: incomingCall.from,
        answer
      });
      
      setCallType(incomingCall.callType);
      setIncomingCall(null);
      console.log("Call accepted successfully");
      
    } catch (error) {
      console.error("Error accepting call:", error);
      toast.error("Error accepting call. Please try again.");
      setCallState(CALL_STATES.IDLE);
      setIncomingCall(null);
      setIsMediaLoading(false);
    }
  }, [incomingCall, createPeerConnection, audioManager, mediaManager]);

  // Enhanced call rejection
  const handleRejectCall = useCallback(() => {
    if (incomingCall) {
      socketRef.current?.emit("call_reject", { to: incomingCall.from });
      audioManager.stopRingtone();
      toast.info("Call rejected.");
      setIncomingCall(null);
      setCallState(CALL_STATES.IDLE);
    }
  }, [incomingCall, audioManager]);

  // Media control functions
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const newMutedState = !isAudioMuted;
      mediaManager.toggleAudio(localStream, newMutedState);
      setIsAudioMuted(newMutedState);
      toast.info(newMutedState ? "Microphone muted" : "Microphone unmuted");
    }
  }, [localStream, isAudioMuted, mediaManager]);

  const toggleVideo = useCallback(() => {
    if (localStream && callType === "video") {
      const newMutedState = !isVideoMuted;
      mediaManager.toggleVideo(localStream, newMutedState);
      setIsVideoMuted(newMutedState);
      toast.info(newMutedState ? "Camera off" : "Camera on");
    }
  }, [localStream, isVideoMuted, callType, mediaManager]);

  const toggleSpeaker = useCallback(() => {
    const newSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(newSpeakerState);
    
    if (remoteAudioRef.current) {
      remoteAudioRef.current.volume = newSpeakerState ? 1.0 : 0.8;
    }
    
    toast.info(newSpeakerState ? "Speaker on" : "Speaker off");
  }, [isSpeakerOn]);

  // Enhanced message reading
  const markMessagesAsRead = useCallback(async () => {
    const targetUserId = isAdmin ? selectedClientId : clientId;
    if (!targetUserId) return;

    try {
      const response = await fetch(`${SOCKET_URL}/api/messages/markAsRead`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
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

  // Enhanced chat toggle
  const handleChatToggle = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Chat toggle clicked, isChatOpen:", !isChatOpen);
    setIsChatOpen(prev => !prev);
    setIsMinimized(false);
    
    if (!isAdmin) {
      setUnreadCount(0);
    } else if (isAdmin && selectedClientId) {
      setUnreadCounts(prev => {
        const updated = { ...prev };
        delete updated[selectedClientId];
        return updated;
      });
    }
    
    markMessagesAsRead();
    
    setTimeout(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, 100);
  }, [isChatOpen, isAdmin, selectedClientId, markMessagesAsRead]);

  // Enhanced minimize toggle
  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized(prev => !prev);
    
    if (!isMinimized && !isAdmin) {
      setUnreadCount(0);
      markMessagesAsRead();
    }
  }, [isMinimized, isAdmin, markMessagesAsRead]);

  // Enhanced message sending with validation and retry
  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      toast.error("Message cannot be empty!");
      return;
    }
    
    if (trimmedMessage.length > 1000) {
      toast.error("Message is too long (max 1000 characters).");
      return;
    }
    
    if (isAdmin && !selectedClientId) {
      toast.error("No client selected.");
      return;
    }
    
    if (!isConnected) {
      toast.error("Not connected to server. Please wait and try again.");
      return;
    }
    
    const newMessage = {
      id: Date.now() + Math.random(),
      sender: isAdmin ? "admin" : "client",
      message: trimmedMessage,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    try {
      const eventName = isAdmin ? "send_message_to_client" : "send_message_to_admin";
      const payload = { 
        clientId: selectedClientId, 
        message: trimmedMessage,
        messageId: newMessage.id
      };
      
      socketRef.current?.emit(eventName, payload);
      
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'failed' } : msg
      ));
    }
  }, [message, isAdmin, selectedClientId, isConnected]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleSendMessage();
      }
      
      if (event.key === 'Escape' && isChatOpen) {
        setIsChatOpen(false);
      }
    };
    
    if (isChatOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isChatOpen, handleSendMessage]);

  // Enhanced client selection
  const handleClientSelect = useCallback((clientId) => {
    setSelectedClientId(clientId);
    
    if (clientId) {
      setUnreadCounts(prev => {
        const updated = { ...prev };
        delete updated[clientId];
        return updated;
      });
      
      markMessagesAsRead();
    }
  }, [markMessagesAsRead]);

  // Enhanced client list rendering
  const renderClientList = useCallback(() => (
    <div className="client-list-container">
      <select
        onChange={(e) => handleClientSelect(e.target.value)}
        value={selectedClientId || ""}
        className="client-selector"
        disabled={!isConnected}
        aria-label="Select a client to chat with"
      >
        <option value="">Select a client</option>
        {clients.length === 0 ? (
          <option disabled>No clients connected</option>
        ) : (
          clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name || "Unknown Client"} 
              {unreadCounts[client.id] ? ` (${unreadCounts[client.id]})` : ""}
              {client.online ? " 🟢" : " 🔴"}
            </option>
          ))
        )}
      </select>
      {selectedClientId && (
        <div className="selected-client-info">
          <span className="client-status">
            {clients.find(c => c.id === selectedClientId)?.online ? "Online" : "Offline"}
          </span>
        </div>
      )}
    </div>
  ), [clients, selectedClientId, unreadCounts, isConnected, handleClientSelect]);

  // Connection status indicator
  const renderConnectionStatus = useCallback(() => {
    const statusConfig = {
      [CONNECTION_STATES.CONNECTED]: { text: "Online", class: "connected", icon: "🟢" },
      [CONNECTION_STATES.CONNECTING]: { text: "Connecting...", class: "connecting", icon: "🟡" },
      [CONNECTION_STATES.RECONNECTING]: { text: "Reconnecting...", class: "reconnecting", icon: "🟡" },
      [CONNECTION_STATES.DISCONNECTED]: { text: "Offline", class: "disconnected", icon: "🔴" },
      [CONNECTION_STATES.ERROR]: { text: "Connection Error", class: "error", icon: "❌" }
    };
    
    const config = statusConfig[connectionState] || statusConfig[CONNECTION_STATES.DISCONNECTED];
    
    return (
      <div className={`connection-status ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        <span className="status-text">{config.text}</span>
        {reconnectAttempts > 0 && connectionState === CONNECTION_STATES.RECONNECTING && (
          <span className="reconnect-attempts">({reconnectAttempts}/5)</span>
        )}
      </div>
    );
  }, [connectionState, reconnectAttempts]);

  // Enhanced message rendering
  const renderMessages = useMemo(() => (
    <div className={`chat-messages ${isAdmin ? "admin-view" : "client-view"}`} aria-live="polite">
      {memoizedMessages.length === 0 ? (
        <div className="no-messages">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        memoizedMessages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender} ${msg.status || ''}`}>
            <div className="message-header">
              <span className="message-author">{msg.sender || "Unknown User"}:</span>
              <span className="message-time">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
              </span>
            </div>
            <p className="message-content">{msg.message}</p>
            {msg.status && (
              <div className="message-status">
                {msg.status === 'sending' && '⏳'}
                {msg.status === 'sent' && '✓'}
                {msg.status === 'failed' && '❌'}
              </div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  ), [memoizedMessages, isAdmin]);

  // Enhanced call controls
  const renderCallControls = useCallback(() => (
    <div className="call-controls">
      <button 
        className={`control-button audio ${isAudioMuted ? 'muted' : ''}`}
        onClick={toggleAudio}
        title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isAudioMuted ? "🎤❌" : "🎤"}
      </button>
      
      {callType === "video" && (
        <button 
          className={`control-button video ${isVideoMuted ? 'muted' : ''}`}
          onClick={toggleVideo}
          title={isVideoMuted ? "Turn on camera" : "Turn off camera"}
          aria-label={isVideoMuted ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoMuted ? "📹❌" : "📹"}
        </button>
      )}
      
      <button 
        className={`control-button speaker ${isSpeakerOn ? 'active' : ''}`}
        onClick={toggleSpeaker}
        title={isSpeakerOn ? "Turn off speaker" : "Turn on speaker"}
        aria-label={isSpeakerOn ? "Turn off speaker" : "Turn on speaker"}
      >
        {isSpeakerOn ? "🔊" : "🔉"}
      </button>
      
      <button 
        className="control-button end-call"
        onClick={endCall}
        title="End call"
        aria-label="End call"
      >
        📞❌
      </button>
    </div>
  ), [isAudioMuted, isVideoMuted, isSpeakerOn, callType, toggleAudio, toggleVideo, toggleSpeaker, endCall]);

  // Calculate total unread messages
  const totalUnreadMessages = useMemo(() => {
    return isAdmin 
      ? Object.values(unreadCounts).reduce((a, b) => a + b, 0)
      : unreadCount;
  }, [isAdmin, unreadCounts, unreadCount]);

  return (
    <ErrorBoundary>
      <div className="chat-app">
        {isAdmin && (
          <div className="admin-status-panel">
            {renderConnectionStatus()}
            <div className="admin-stats">
              <span>Clients: {clients.length}</span>
              <span>Messages: {totalUnreadMessages}</span>
            </div>
          </div>
        )}

        {!isChatOpen ? (
          <div className="chat-bubble-container">
            <div className="chat-info">
              <p>Chat with us!</p>
              {!isAdmin && !adminOnline && (
                <p className="admin-offline-notice">Admin is currently offline</p>
              )}
            </div>
            <button 
              className="chat-bubble-icon"
              onClick={handleChatToggle}
              disabled={!isConnected}
              title={isConnected ? "Open chat" : "Connecting..."}
              aria-label={isConnected ? "Open chat window" : "Chat is connecting"}
              aria-disabled={!isConnected}
            >
              💬 
              {totalUnreadMessages > 0 && (
                <span className="unread-count" aria-label={`${totalUnreadMessages} unread messages`}>
                  {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className={`chat-container ${isMinimized ? "minimized" : ""}`}>
            {isMinimized && (
              <h4>Chat {isAdmin ? "Admin" : "Client"}</h4>
            )}
            {!isMinimized && (
              <>
                <div className="chat-header">
                  <div className="header-left">
                    <h4>Chat {isAdmin ? "Admin" : "Client"}</h4>
                    {!isAdmin && (
                      <div className={`admin-status ${adminOnline ? 'online' : 'offline'}`}>
                        Admin is {adminOnline ? "Online" : "Offline"}
                        {lastSeen && !adminOnline && (
                          <span className="last-seen">
                            Last seen: {new Date(lastSeen).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                    {isAdmin && renderConnectionStatus()}
                  </div>
                  
                  <div className="header-right">
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
                        title={isMinimized ? "Expand" : "Minimize"}
                        aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                      >
                        {isMinimized ? "🗖" : "__"}
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
                {renderMessages()}
                
                <div className="chat-input">
                  <textarea
                    ref={messageInputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message... (Ctrl+Enter to send)"
                    maxLength={1000}
                    disabled={!isConnected || (isAdmin && !selectedClientId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    aria-label="Type your message"
                  />
                  <div className="input-controls">
                    <span className="char-count">
                      {message.length}/1000
                    </span>
                    <button 
                      onClick={handleSendMessage}
                      disabled={!message.trim() || !isConnected || (isAdmin && !selectedClientId)}
                      title="Send message (Ctrl+Enter)"
                      aria-label="Send message"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isMediaLoading && (
          <div className="media-loading">
            <div className="spinner"></div>
            <p>Loading media...</p>
          </div>
        )}

        {inCall && (
          <div className="call-container">
            <div className="call-header">
              <h4>
                {callState === CALL_STATES.CALLING ? "Calling..." : 
                 callState === CALL_STATES.RINGING ? "Ringing..." :
                 `${callType === "audio" ? "Audio" : "Video"} Call`}
              </h4>
              <div className="call-info">
                <span className="call-duration">
                  {callConnected ? formatDuration(callDuration) : "Connecting..."}
                </span>
                <span className={`call-quality ${callQuality}`}>
                  {callConnected && `Quality: ${callQuality}`}
                </span>
              </div>
            </div>
            
            {callType === "video" && (
              <div className="video-container">
                <video 
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="remote-video"
                />
                <video 
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`local-video ${isVideoMuted ? 'muted' : ''}`}
                />
                {isVideoMuted && (
                  <div className="video-muted-overlay local">Your Camera Off</div>
                )}
                {callConnected && !remoteStream && (
                  <div className="video-muted-overlay remote">Remote Camera Off</div>
                )}
              </div>
            )}
            
            <audio 
              ref={remoteAudioRef}
              autoPlay
              style={{ display: 'none' }}
            />
            
            {callType === "audio" && (
              <div className="audio-container">
                <div className="audio-visualization">
                  <div className="audio-wave"></div>
                  <p>Audio call in progress...</p>
                </div>
              </div>
            )}
            
            {callConnected && renderCallControls()}
            
            {!callConnected && (
              <div className="call-connecting">
                <div className="connecting-spinner"></div>
                <p>Connecting...</p>
              </div>
            )}
          </div>
        )}

        {incomingCall && (
          <div className="incoming-call-modal">
            <div className="modal-content">
              <div className="caller-info">
                <h3>Incoming Call</h3>
                <p className="caller-name">
                  From: {incomingCall.from || "Unknown User"}
                </p>
                <p className="call-type">
                  {incomingCall.callType === "audio" ? "📞 Audio Call" : "📹 Video Call"}
                </p>
              </div>
              
              <div className="incoming-call-controls">
                <button 
                  className="accept-button"
                  onClick={handleAcceptCall}
                  title="Accept call"
                  aria-label="Accept incoming call"
                >
                  ✅ Accept
                </button>
                <button 
                  className="reject-button"
                  onClick={handleRejectCall}
                  title="Reject call"
                  aria-label="Reject incoming call"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
            
            <div className="modal-background" onClick={handleRejectCall}></div>
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
          limit={3}
          toastClassName="custom-toast"
        />
      </div>
    </ErrorBoundary>
  );
};

export default ChatApp;