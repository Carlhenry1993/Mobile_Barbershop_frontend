import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChatApp.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary a capturé :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "#e74c3c", background: "#0e1015" }}>
          <h2>Quelque chose s'est mal passé.</h2>
          <p>{this.state.error?.message || "Veuillez rafraîchir la page."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const callReducer = (state, action) => {
  switch (action.type) {
    case "SET_IN_CALL":
      return {...state, inCall: action.payload };
    case "SET_CALL_CONNECTED":
      return {...state, callConnected: action.payload };
    case "SET_CALL_TYPE":
      return {...state, callType: action.payload };
    case "SET_INCOMING_CALL":
      return {...state, incomingCall: action.payload };
    case "SET_LOCAL_STREAM":
      return {...state, localStream: action.payload };
    case "SET_CALL_DURATION":
      return {...state, callDuration: action.payload };
    default:
      return state;
  }
};

const ChatApp = ({ clientId, isAdmin }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const [callState, dispatch] = useReducer(callReducer, {
    inCall: false,
    callConnected: false,
    callType: null,
    incomingCall: null,
    localStream: null,
    callDuration: 0,
  });

  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const reconnectTimeoutRef = useRef(null);
  const callTimerRef = useRef(null);

  const inCallRef = useRef(callState.inCall);
  const selectedClientIdRef = useRef(selectedClientId);
  const callTypeRef = useRef(callState.callType);
  useEffect(() => { inCallRef.current = callState.inCall; }, [callState.inCall]);
  useEffect(() => { selectedClientIdRef.current = selectedClientId; }, [selectedClientId]);
  useEffect(() => { callTypeRef.current = callState.callType; }, [callState.callType]);

  const audioRefs = useRef({
    ringtone: null,
    notification: null,
  });

  const SOCKET_SERVER_URL = "https://api.mrrenaudinbarbershop.com";

  const mediaConstraints = useMemo(() => ({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
    video: {
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
    }
  }), []);

  useEffect(() => {
    const createAudioElement = (src, options = {}) => {
      const audio = new Audio(src);
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      if (options.loop) audio.loop = true;
      return audio;
    };

    audioRefs.current.ringtone = createAudioElement("https://your-supabase-project.storage.supabase.co/storage/v1/object/public/audio/ringtone.mp3", { loop: true });
    audioRefs.current.notification = createAudioElement("https://your-supabase-project.storage.supabase.co/storage/v1/object/public/audio/notification.mp3");

    const ringtone = audioRefs.current.ringtone;
    const notification = audioRefs.current.notification;

    return () => {
      if (ringtone) {
        ringtone.pause();
        ringtone.src = "";
      }
      if (notification) {
        notification.pause();
        notification.src = "";
      }
    };
  }, []);

  const getCallPartnerId = useCallback(() => {
    if (isAdmin) {
      if (!selectedClientIdRef.current) {
        console.error("Aucun client sélectionné pour l'appel.");
        toast.error("Veuillez sélectionner un client avant d'appeler.");
        return null;
      }
      return selectedClientIdRef.current;
    }
    return "admin";
  }, [isAdmin]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

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
          audioRefs.current.ringtone.addEventListener("canplaythrough", resolve, { once: true });
          audioRefs.current.ringtone.addEventListener("error", reject, { once: true });
          audioRefs.current.ringtone.load();
        }),
        audioRefs.current.notification
      ? new Promise((resolve, reject) => {
              audioRefs.current.notification.addEventListener("canplaythrough", resolve, { once: true });
              audioRefs.current.notification.addEventListener("error", reject, { once: true });
              audioRefs.current.notification.load();
            })
          : Promise.resolve(),
      ]);
    } catch (error) {
      console.warn("Avertissement d'initialisation audio :", error);
    }
  }, []);

  useEffect(() => {
    const enableAudio = async () => {
      try {
        if (audioRefs.current.ringtone) {
          await audioRefs.current.ringtone.play();
          await audioRefs.current.ringtone.pause();
          audioRefs.current.ringtone.currentTime = 0;
        }
        await initializeAudio();
      } catch (error) {
        console.warn("Échec du déverrouillage audio :", error);
      }
    };
    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("touchend", enableAudio, { once: true });
    return () => {
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchend", enableAudio);
    };
  }, [initializeAudio]);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.warn("Échec de la demande de permission de notification :", error);
        }
      }
    };
    requestNotificationPermission();
  }, []);

  const audioManager = useMemo(
    () => ({
      startRingtone: async () => {
        try {
          if (audioRefs.current.ringtone && audioRefs.current.ringtone.paused) {
            audioRefs.current.ringtone.loop = true;
            await audioRefs.current.ringtone.play();
          }
        } catch (error) {
          console.error("Erreur de lecture de la sonnerie :", error);
        }
      },
      stopRingtone: () => {
        if (audioRefs.current.ringtone) {
          audioRefs.current.ringtone.pause();
          audioRefs.current.ringtone.currentTime = 0;
        }
      },
      playNotification: async () => {
        if (!audioRefs.current.notification) return;
        try {
          audioRefs.current.notification.currentTime = 0;
          await audioRefs.current.notification.play();
        } catch (error) {
          console.warn("Échec du son de notification :", error);
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (callState.incomingCall) {
      audioManager.startRingtone();
    } else {
      audioManager.stopRingtone();
    }
  }, [callState.incomingCall, audioManager]);

  const stopMediaTracks = useCallback((stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Piste ${track.kind} arrêtée`);
      });
    }
  }, []);

  const endCall = useCallback(() => {
    console.log("Terminaison de l'appel...");
    try {
      audioManager.stopRingtone();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      stopMediaTracks(callState.localStream);
      dispatch({ type: "SET_LOCAL_STREAM", payload: null });
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
      dispatch({ type: "SET_IN_CALL", payload: false });
      dispatch({ type: "SET_CALL_CONNECTED", payload: false });
      dispatch({ type: "SET_CALL_TYPE", payload: null });
      dispatch({ type: "SET_INCOMING_CALL", payload: null });
      pendingCandidatesRef.current = [];
      if (inCallRef.current) {
        const partnerId = getCallPartnerId();
        if (partnerId) {
          socketRef.current?.emit("call_end", { to: partnerId });
          toast.info("L'appel a été terminé.");
        } else {
          console.error("Impossible d'obtenir l'ID du partenaire pour terminer l'appel.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la terminaison de l'appel :", error);
      toast.error("Erreur lors de la terminaison de l'appel.");
    }
  }, [callState.localStream, getCallPartnerId, stopMediaTracks, audioManager]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${SOCKET_SERVER_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error(`Erreur HTTP! statut : ${response.status}`);
        const data = await response.json();
        setMessages(data.map((msg) => ({
          id: msg.id,
          sender: msg.sender_id === clientId? "client" : "admin",
          senderId: msg.sender_id,
          message: msg.message,
          timestamp: msg.timestamp,
        })));
      } catch (error) {
        console.error("Erreur lors du chargement des messages :", error);
        toast.error("Échec du chargement des messages.");
      }
    };
    fetchMessages();
  }, [clientId]);

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
        console.log("Connecté au serveur de signalisation :", SOCKET_SERVER_URL);
        setIsConnected(true);
        setReconnectAttempts(0);
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: true });
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket déconnecté :", reason);
        setIsConnected(false);
        if (isAdmin) {
          socket.emit("admin_status", { adminId: clientId, online: false });
        }
        if (callState.inCall) endCall();
        if (reason!== "io client disconnect") {
          const attempts = reconnectAttempts + 1;
          setReconnectAttempts(attempts);
          const delay = Math.min(1000 * Math.pow(2, attempts) + Math.random() * 100, 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (attempts < 5) {
              connectSocket();
            } else {
              toast.error("Échec de la connexion. Veuillez rafraîchir la page.");
            }
          }, delay);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Erreur de connexion :", error);
        toast.error("Échec de la connexion au serveur.");
      });

      socket.on("new_message", (data) => {
        console.log("Nouveau message reçu :", data);
        const newMessage = {
          id: Date.now() + Math.random(),
          sender: data.sender || "Utilisateur inconnu",
          message: data.message,
          senderId: data.senderId,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        audioManager.playNotification();
        if (Notification.permission === "granted" && (!isChatOpen || isMinimized)) {
          const notification = new Notification(`Message de ${data.sender || "Utilisateur"}`, {
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
          if (selectedClientId!== data.senderId) {
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
          console.log("Liste des clients mise à jour :", clientList);
          setClients(clientList);
        });
      } else {
        socket.on("admin_status", (data) => {
          console.log("Statut de l'administrateur reçu :", data);
          setAdminOnline(data.online);
        });
      }

      socket.on("call_offer", (data) => {
        console.log("Offre d'appel reçue :", data);
        if (!callState.inCall) {
          dispatch({ type: "SET_INCOMING_CALL", payload: data });
        } else {
          socket.emit("call_busy", { to: data.from });
          console.log("Utilisateur occupé, signal envoyé à :", data.from);
        }
      });

      socket.on("call_answer", async (data) => {
        if (pcRef.current && callState.inCall) {
          try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log("Description distante définie avec succès.");
            for (const candidate of pendingCandidatesRef.current) {
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                console.log("Candidat ICE en attente ajouté.");
              } catch (err) {
                console.error("Erreur lors de l'ajout du candidat en attente :", err);
              }
            }
            pendingCandidatesRef.current = [];
          } catch (error) {
            console.error("Erreur lors de la réception de call_answer :", error);
            endCall();
          }
        }
      });

      socket.on("call_candidate", async (data) => {
        if (pcRef.current) {
          if (pcRef.current.remoteDescription?.type) {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log("Candidat ICE ajouté avec succès.");
            } catch (error) {
              console.error("Erreur lors de l'ajout du candidat ICE :", error);
            }
          } else {
            pendingCandidatesRef.current.push(data.candidate);
            console.log("Candidat ICE mis en attente :", data.candidate);
          }
        }
      });

      socket.on("call_reject", () => {
        console.log("Appel rejeté par le destinataire.");
        toast.info("Appel rejeté par le destinataire.");
        endCall();
      });

      socket.on("call_busy", () => {
        console.log("Destinataire occupé.");
        toast.info("Le destinataire est actuellement occupé.");
        endCall();
      });

      socket.on("call_end", () => {
        console.log("Appel terminé par l'autre partie.");
        toast.info("Appel terminé par l'autre partie.");
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
  }, [isAdmin, clientId, selectedClientId, endCall, isChatOpen, isMinimized, audioManager, reconnectAttempts, getCallPartnerId, callState.inCall]);

  useEffect(() => {
    if (callState.inCall && callState.callConnected) {
      callTimerRef.current = setInterval(() => {
        dispatch({ type: "SET_CALL_DURATION", payload: callState.callDuration + 1 });
      }, 1000);
    } else {
      dispatch({ type: "SET_CALL_DURATION", payload: 0 });
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callState.inCall, callState.callConnected, callState.callDuration]);

  const formatDuration = useCallback((duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

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
        console.log("Candidat ICE généré :", event.candidate);
        const partnerId = getCallPartnerId();
        if (partnerId) {
          socketRef.current?.emit("call_candidate", {
            to: partnerId,
            candidate: event.candidate,
          });
        } else {
          console.error("Échec de l'envoi du candidat ICE : ID du partenaire invalide.");
        }
      }
    };
    pc.onconnectionstatechange = () => {
      console.log("État de la connexion WebRTC :", pc.connectionState);
      if (["connected", "completed"].includes(pc.connectionState)) {
        dispatch({ type: "SET_CALL_CONNECTED", payload: true });
      }
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        endCall();
      }
    };
    pc.oniceconnectionstatechange = () => {
      console.log("État de la connexion ICE :", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        toast.error("Échec de l'établissement d'une connexion stable.");
        endCall();
      }
    };
    pc.ontrack = (event) => {
      console.log("Piste distante reçue :", event.track.kind);
      let stream = event.streams[0] || new MediaStream();
      if (event.track.kind === "audio" && remoteAudioRef.current) {
        stream.addTrack(event.track);
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch((err) => console.error("Erreur de lecture de l'audio distant :", err));
      } else if (event.track.kind === "video" && remoteVideoRef.current) {
        stream.addTrack(event.track);
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch((err) => console.error("Erreur de lecture de la vidéo distante :", err));
      }
    };
    return pc;
  }, [getCallPartnerId, endCall]);

  const initiateCall = useCallback(
    async (type) => {
      const partnerId = getCallPartnerId();
      if (!partnerId) return;
      if (!isConnected) {
        toast.error("Non connecté au serveur.");
        return;
      }
      try {
        const constraints = type === "audio"? mediaConstraints.audio : mediaConstraints.video;
        const stream = await navigator.mediaDevices.getUserMedia(constraints).catch(async (error) => {
          if (type === "video" && error.name === "NotFoundError") {
            toast.warn("Caméra non trouvée, basculement vers audio uniquement.");
            return await navigator.mediaDevices.getUserMedia(mediaConstraints.audio);
          }
          throw error;
        });
        dispatch({ type: "SET_LOCAL_STREAM", payload: stream });
        if (localVideoRef.current && type === "video") {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch((err) => console.error("Erreur de lecture de la vidéo locale :", err));
        }
        pcRef.current = createPeerConnection();
        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
        });
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        console.log("Émission de call_offer vers :", partnerId);
        socketRef.current?.emit("call_offer", {
          to: partnerId,
          callType: type,
          offer,
        });
        dispatch({ type: "SET_CALL_TYPE", payload: type });
        dispatch({ type: "SET_IN_CALL", payload: true });
        setTimeout(() => {
          if (inCallRef.current &&!callState.callConnected) {
            toast.info("Le destinataire n'a pas répondu.");
            endCall();
          }
        }, 30000);
      } catch (error) {
        console.error("Erreur lors de l'initiation de l'appel :", error);
        const errorMessages = {
          NotFoundError: "Aucun microphone ou caméra trouvé.",
          NotAllowedError: "Permission refusée pour le microphone ou la caméra.",
          NotReadableError: "La caméra ou le microphone est en cours d'utilisation.",
        };
        toast.error(errorMessages[error.name] || "Erreur lors du démarrage de l'appel.");
      }
    },
    [isConnected, createPeerConnection, getCallPartnerId, callState.callConnected, endCall, mediaConstraints]
  );

  const handleAcceptCall = useCallback(async () => {
    if (!callState.incomingCall) return;
    audioManager.stopRingtone();
    try {
      const constraints = callState.incomingCall.callType === "audio"? mediaConstraints.audio : mediaConstraints.video;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      dispatch({ type: "SET_LOCAL_STREAM", payload: stream });
      if (localVideoRef.current && callState.incomingCall.callType === "video") {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch((err) => console.error("Erreur de lecture de la vidéo locale :", err));
      }
      pcRef.current = createPeerConnection();
      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(callState.incomingCall.offer));
      for (const candidate of pendingCandidatesRef.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Erreur lors de l'ajout du candidat en attente :", err);
        }
      }
      pendingCandidatesRef.current = [];
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      console.log("Émission de call_answer vers :", callState.incomingCall.from);
      socketRef.current?.emit("call_answer", {
        to: callState.incomingCall.from,
        answer,
      });
      dispatch({ type: "SET_CALL_TYPE", payload: callState.incomingCall.callType });
      dispatch({ type: "SET_IN_CALL", payload: true });
      dispatch({ type: "SET_INCOMING_CALL", payload: null });
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'appel :", error);
      toast.error("Erreur lors de l'acceptation de l'appel.");
      endCall();
    }
  }, [callState.incomingCall, createPeerConnection, audioManager, endCall, mediaConstraints]);

  const handleRejectCall = useCallback(() => {
    if (callState.incomingCall) {
      console.log("Rejet de l'appel de :", callState.incomingCall.from);
      socketRef.current?.emit("call_reject", { to: callState.incomingCall.from });
      audioManager.stopRingtone();
      toast.info("Vous avez rejeté l'appel.");
      dispatch({ type: "SET_INCOMING_CALL", payload: null });
    }
  }, [callState.incomingCall, audioManager]);

  const handleMarkMessagesAsRead = useCallback(async () => {
    const targetUserId = isAdmin? selectedClientId : clientId;
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
        throw new Error(`Erreur HTTP! statut : ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors du marquage des messages comme lus :", error);
    }
  }, [clientId, isAdmin, selectedClientId]);

  const handleChatToggle = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("Bascule du chat cliquée", {
        isChatOpen:!isChatOpen,
        eventTarget: event.target.tagName,
        eventCurrentTarget: event.currentTarget.tagName,
        eventType: event.type,
      });
      setIsChatOpen((prev) =>!prev);
      setIsMinimized(false);
      setIsMaximized(false);
      if (!isAdmin) {
        setUnreadCount(0);
      } else if (isAdmin && selectedClientId) {
        setUnreadCounts((prev) => {
          const updated = {...prev };
          delete updated[selectedClientId];
          return updated;
        });
      }
      handleMarkMessagesAsRead();
    },
    [isChatOpen, isAdmin, selectedClientId, handleMarkMessagesAsRead]
  );

  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) =>!prev);
    setIsMaximized(false);
    if (!isMinimized &&!isAdmin) {
      setUnreadCount(0);
      handleMarkMessagesAsRead();
    }
  }, [isMinimized, isAdmin, handleMarkMessagesAsRead]);

  const handleMaximizeToggle = useCallback(() => {
    setIsMaximized((prev) =>!prev);
    setIsMinimized(false);
  }, []);

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      toast.error("Le message ne peut pas être vide!");
      return;
    }
    if (isAdmin &&!selectedClientId) {
      toast.error("Aucun client sélectionné.");
      return;
    }
    if (!isConnected) {
      toast.error("Non connecté au serveur.");
      return;
    }
    const newMessage = {
      id: Date.now() + Math.random(),
      sender: isAdmin? "admin" : "client",
      message: trimmedMessage,
      status: "sending",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    try {
      socketRef.current?.emit(
        isAdmin? "send_message_to_client" : "send_message_to_admin",
        { clientId: selectedClientId, message: trimmedMessage }
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id? {...msg, status: "sent" } : msg
        )
      );
      setMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id? {...msg, status: "failed" } : msg
        )
      );
      toast.error("Échec de l'envoi du message.");
    }
  }, [message, isAdmin, selectedClientId, isConnected]);

  const renderClientList = useCallback(
    () => (
      <select
        onChange={(e) => {
          const clientId = e.target.value;
          setSelectedClientId(clientId);
          if (clientId) {
            setUnreadCounts((prev) => {
              const updated = {...prev };
              delete updated[clientId];
              return updated;
            });
            handleMarkMessagesAsRead();
          }
        }}
        value={selectedClientId || ""}
        className="client-selector"
        disabled={!isConnected}
        aria-label="Sélectionnez un client pour discuter"
      >
        <option value="">Sélectionnez un client</option>
        {clients.length === 0? (
          <option disabled>Aucun client connecté</option>
        ) : (
          clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name || "Client inconnu"}
              {unreadCounts[client.id]? ` (${unreadCounts[client.id]})` : ""}
              {client.online? " 🟢" : " 🔴"}
            </option>
          ))
        )}
      </select>
    ),
    [clients, selectedClientId, unreadCounts, isConnected, handleMarkMessagesAsRead]
  );

  const renderMessages = useMemo(() => {
    try {
      return (
        <div className={`chat-messages ${isAdmin? "admin-view" : "client-view"}`} aria-live="polite">
          {messages.length === 0? (
            <div className="no-messages">
              <p>Pas encore de messages. Commencez une conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender} ${msg.status || ""}`}>
                <span className="message-author">{msg.sender || "Utilisateur inconnu"}:</span>
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
      console.error("Erreur de rendu des messages :", error);
      return <div>Erreur de rendu des messages. Veuillez rafraîchir la page.</div>;
    }
  }, [messages, isAdmin]);

  const totalUnreadMessages = isAdmin
? Object.values(unreadCounts).reduce((a, b) => a + b, 0)
    : unreadCount;

  return (
    <ErrorBoundary>
      <div className="chat-app">
        {isAdmin && (
          <div className="status-indicator">
            <span>
              Vous êtes {isConnected? "en ligne 🟢" : "hors ligne 🔴"}
              {reconnectAttempts > 0 && ` (Reconnexion : ${reconnectAttempts}/5)`}
            </span>
          </div>
        )}
        {!isChatOpen? (
          <div className="chat-bubble-container">
            <p className="chat-info">Discutez avec Mr. Renaudin!</p>
            {!isAdmin &&!adminOnline && (
              <p className="admin-offline-notice">L'équipe est actuellement hors ligne</p>
            )}
            <button
              type="button"
              className="chat-bubble-icon"
              onClick={handleChatToggle}
              disabled={!isConnected}
              title={isConnected? "Ouvrir le chat" : "Connexion en cours..."}
              aria-label={isConnected? "Ouvrir la fenêtre de chat" : "Le chat est en cours de connexion"}
              aria-expanded={isChatOpen}
            >
              💬
              {totalUnreadMessages > 0 && (
                <span className="unread-count" aria-label={`${totalUnreadMessages} messages non lus`}>
                  {totalUnreadMessages > 99? "99+" : totalUnreadMessages}
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className={`chat-container ${isMinimized? "minimized" : ""} ${isMaximized? "maximized" : ""}`}>
            {isMinimized? (
              <div className="chat-header minimized">
                <h4>Chat {isAdmin? "Administrateur" : "Client"}</h4>
                <div className="chat-controls">
                  <button
                    className="minimize-button"
                    onClick={handleMinimizeToggle}
                    title="Restaurer"
                    aria-label="Restaurer le chat"
                  >
                    🗖
                  </button>
                  <button
                    className="maximize-button"
                    onClick={handleMaximizeToggle}
                    title={isMaximized? "Restaurer" : "Maximiser"}
                    aria-label={isMaximized? "Restaurer le chat" : "Maximiser le chat"}
                  >
                    {isMaximized? "🗗" : "🗖"}
                  </button>
                  <button
                    className="close-button"
                    onClick={handleChatToggle}
                    title="Fermer le chat"
                    aria-label="Fermer le chat"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="chat-header">
                  <div>
                    <h4>Chat {isAdmin? "Administrateur" : "Client"}</h4>
                    {!isAdmin && (
                      <div className="admin-status">
                        L'équipe est {adminOnline? "en ligne 🟢" : "hors ligne 🔴"}
                      </div>
                    )}
                  </div>
                  <div className="header-buttons">
                    <div className="call-buttons-container">
                      <button
                        className="call-button audio"
                        onClick={() => initiateCall("audio")}
                        disabled={callState.inCall ||!isConnected || (isAdmin &&!selectedClientId)}
                        title="Démarrer un appel audio"
                        aria-label="Démarrer un appel audio"
                      >
                        📞
                      </button>
                      <button
                        className="call-button video"
                        onClick={() => initiateCall("video")}
                        disabled={callState.inCall ||!isConnected || (isAdmin &&!selectedClientId)}
                        title="Démarrer un appel vidéo"
                        aria-label="Démarrer un appel vidéo"
                      >
                        📹
                      </button>
                                        </div>
                    <div className="chat-controls">
                      <button
                        className="minimize-button"
                        onClick={handleMinimizeToggle}
                        title={isMinimized? "Restaurer" : "Minimiser"}
                        aria-label={isMinimized? "Restaurer le chat" : "Minimiser le chat"}
                      >
                        _
                      </button>
                      <button
                        className="maximize-button"
                        onClick={handleMaximizeToggle}
                        title={isMaximized? "Restaurer" : "Maximiser"}
                        aria-label={isMaximized? "Restaurer le chat" : "Maximiser le chat"}
                      >
                        {isMaximized? "🗗" : "🗖"}
                      </button>
                      <button
                        className="close-button"
                        onClick={handleChatToggle}
                        title="Fermer le chat"
                        aria-label="Fermer le chat"
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
                    placeholder="Tapez votre message..."
                    maxLength={1000}
                    disabled={!isConnected || (isAdmin &&!selectedClientId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" &&!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    aria-label="Entrée de message"
                    aria-describedby="chat-input-instructions"
                  />
                  <span id="chat-input-instructions" className="sr-only">
                    Tapez votre message et appuyez sur Entrée pour envoyer. Shift + Entrée pour une nouvelle ligne.
                  </span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() ||!isConnected || (isAdmin &&!selectedClientId)}
                    aria-label="Envoyer le message"
                  >
                    Envoyer
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {callState.inCall && (
          <div className="call-container">
            <h4>
              {callState.callConnected
            ? `${callState.callType === "audio"? "Appel Audio" : "Appel Vidéo"}`
                : "Connexion en cours..."}
            </h4>
            {callState.callType === "video" && (
              <div className="video-container">
                <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
                <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
              </div>
            )}
            <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />
            {callState.callType === "audio" && (
              <div className="audio-container">
                <p>Appel audio en cours...</p>
              </div>
            )}
            <div className="call-timer">Durée de l'appel : {formatDuration(callState.callDuration)}</div>
            <div className="call-controls">
              <button
                onClick={() => {
                  if (callState.localStream) {
                    callState.localStream.getAudioTracks().forEach((track) => {
                      track.enabled =!track.enabled;
                    });
                    toast.info(callState.localStream.getAudioTracks()[0].enabled? "Microphone activé" : "Microphone coupé");
                  }
                }}
                aria-label={callState.localStream?.getAudioTracks()[0]?.enabled? "Couper le microphone" : "Activer le microphone"}
              >
                {callState.localStream?.getAudioTracks()[0]?.enabled? "Couper" : "Activer"}
              </button>
              <button onClick={endCall} aria-label="Terminer l'appel">Terminer l'appel</button>
            </div>
          </div>
        )}

        {callState.incomingCall && (
          <div className="incoming-call-modal">
            <p>
              Appel {callState.incomingCall.callType === "audio"? "audio" : "vidéo"} entrant de{" "}
              {callState.incomingCall.from || "Utilisateur inconnu"}
            </p>
            <button onClick={handleAcceptCall} aria-label="Accepter l'appel entrant">Accepter</button>
            <button onClick={handleRejectCall} aria-label="Rejeter l'appel entrant">Rejeter</button>
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
          theme="dark"
        />
      </div>
    </ErrorBoundary>
  );
};

export default ChatApp;