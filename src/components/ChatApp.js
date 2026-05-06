import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Composant Error Boundary
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

// Styles injectés pour match le thème noir/gold
const useChatStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-chat-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
.chat-app {
        --chat-black: #0e1015;
        --chat-charcoal: #161b24;
        --chat-card: #1e2535;
        --chat-border: #2a3348;
        --chat-gold: #d4a843;
        --chat-gold-lt: #f0c96a;
        --chat-steel: #8ba8c8;
        --chat-cream: #eef2f7;
        --chat-light: #b8c8da;
        --chat-muted: #7888a0;
        --chat-danger: #e74c3c;
        --chat-success: #27ae60;
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
      }

.chat-bubble-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9998;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }

.chat-info {
        background: var(--chat-card);
        color: var(--chat-light);
        padding: 8px 14px;
        font-size: 0.8rem;
        border: 1px solid var(--chat-border);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }

.admin-offline-notice {
        background: rgba(231,76,60,0.1);
        border: 1px solid rgba(231,76,60,0.3);
        color: #ff8a7a;
        padding: 6px 12px;
        font-size: 0.75rem;
      }

.chat-bubble-icon {
        width: 56px;
        height: 56px;
        background: var(--chat-gold);
        color: var(--chat-black);
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s, transform 0.2s;
        position: relative;
      }
.chat-bubble-icon:hover {
        background: var(--chat-gold-lt);
        transform: scale(1.05);
      }
.chat-bubble-icon:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

.unread-count {
        position: absolute;
        top: -6px;
        right: -6px;
        background: var(--chat-danger);
        color: white;
        font-size: 0.7rem;
        font-weight: 700;
        min-width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
      }

.chat-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 380px;
        max-height: 600px;
        background: var(--chat-card);
        border: 1px solid var(--chat-border);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        transition: all 0.3s ease;
      }
      @media (max-width: 480px) {
.chat-container { width: calc(100vw - 32px); right: 16px; }
      }

.chat-container.minimized {
        height: 48px;
        overflow: hidden;
      }

.chat-container.maximized {
        width: 90vw;
        max-width: 900px;
        height: 85vh;
        max-height: none;
        bottom: 50%;
        right: 50%;
        transform: translate(50%, 50%);
      }

.chat-header {
        background: var(--chat-charcoal);
        border-bottom: 1px solid var(--chat-border);
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }
.chat-header.minimized {
        border-bottom: none;
      }

.chat-header h4 {
        font-family: 'Playfair Display', serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--chat-cream);
        margin: 0;
      }

.admin-status {
        font-size: 0.75rem;
        color: var(--chat-muted);
        margin-top: 2px;
      }

.header-buttons {
        display: flex;
        align-items: center;
        gap: 12px;
      }

.call-buttons-container {
        display: flex;
        gap: 8px;
      }

.call-button {
        width: 32px;
        height: 32px;
        background: transparent;
        border: 1px solid rgba(184,200,218,0.2);
        color: var(--chat-light);
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
.call-button:hover:not(:disabled) {
        border-color: var(--chat-gold);
        color: var(--chat-gold);
        background: rgba(212,168,67,0.1);
      }
.call-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

.chat-controls {
        display: flex;
        gap: 4px;
      }

.minimize-button,.maximize-button,.close-button {
        width: 28px;
        height: 28px;
        background: transparent;
        border: none;
        color: var(--chat-muted);
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s, background 0.2s;
      }
.minimize-button:hover,.maximize-button:hover {
        background: rgba(184,200,218,0.1);
        color: var(--chat-cream);
      }
.close-button:hover {
        background: rgba(231,76,60,0.2);
        color: var(--chat-danger);
      }

.client-selector {
        width: 100%;
        background: var(--chat-black);
        border: 1px solid var(--chat-border);
        border-left: none;
        border-right: none;
        color: var(--chat-cream);
        padding: 10px 16px;
        font-size: 0.85rem;
        font-family: 'DM Sans', sans-serif;
      }
.client-selector:focus {
        outline: none;
        border-color: var(--chat-gold);
      }
.client-selector:disabled {
        opacity: 0.5;
      }

.chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: var(--chat-black);
      }

.chat-messages.admin-view {
        background: var(--chat-black);
      }

.no-messages {
        text-align: center;
        color: var(--chat-muted);
        padding: 40px 20px;
        font-size: 0.9rem;
      }

.message {
        margin-bottom: 12px;
        padding: 10px 14px;
        max-width: 80%;
        word-wrap: break-word;
        position: relative;
      }

.message.admin {
        background: rgba(212,168,67,0.15);
        border: 1px solid rgba(212,168,67,0.3);
        margin-left: auto;
        color: var(--chat-cream);
      }

.message.client {
        background: var(--chat-charcoal);
        border: 1px solid var(--chat-border);
        color: var(--chat-light);
      }

.message-author {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--chat-gold);
        display: block;
        margin-bottom: 4px;
      }

.message p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
      }

.message-timestamp {
        font-size: 0.7rem;
        color: var(--chat-muted);
        display: block;
        margin-top: 6px;
      }

.message-status {
        position: absolute;
        bottom: 8px;
        right: 8px;
        font-size: 0.7rem;
        color: var(--chat-muted);
      }

.chat-input {
        border-top: 1px solid var(--chat-border);
        padding: 12px;
        display: flex;
        gap: 8px;
        background: var(--chat-card);
        flex-shrink: 0;
      }

.chat-input textarea {
        flex: 1;
        background: var(--chat-black);
        border: 1px solid var(--chat-border);
        color: var(--chat-cream);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.9rem;
        padding: 10px 12px;
        resize: none;
        min-height: 44px;
        max-height: 120px;
      }
.chat-input textarea:focus {
        outline: none;
        border-color: var(--chat-gold);
      }
.chat-input textarea:disabled {
        opacity: 0.5;
      }

.chat-input button {
        background: var(--chat-gold);
        color: var(--chat-black);
        border: none;
        padding: 0 20px;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        cursor: pointer;
        transition: background 0.2s;
      }
.chat-input button:hover:not(:disabled) {
        background: var(--chat-gold-lt);
      }
.chat-input button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

.status-indicator {
        position: fixed;
        top: 16px;
        right: 16px;
        background: var(--chat-card);
        border: 1px solid var(--chat-border);
        padding: 8px 14px;
        font-size: 0.8rem;
        color: var(--chat-light);
        z-index: 10000;
      }

.call-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--chat-card);
        border: 1px solid var(--chat-border);
        padding: 24px;
        z-index: 10001;
        min-width: 400px;
        max-width: 90vw;
        box-shadow: 0 20px 60px rgba(0,0,0.8);
      }

.call-container h4 {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        color: var(--chat-cream);
        margin: 0 20px 0;
        text-align: center;
      }

.video-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }

.remote-video {
        width: 100%;
        background: var(--chat-black);
        border: 1px solid var(--chat-border);
      }

.local-video {
        width: 120px;
        position: absolute;
        bottom: 100px;
        right: 24px;
        background: var(--chat-black);
        border: 2px solid var(--chat-gold);
      }

.audio-container {
        text-align: center;
        padding: 40px 20px;
        color: var(--chat-light);
      }

.call-timer {
        text-align: center;
        font-size: 1.25rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        color: var(--chat-gold);
        margin-bottom: 20px;
      }

.call-controls {
        display: flex;
        justify-content: center;
        gap: 12px;
      }

.call-controls button {
        padding: 12px 24px;
        background: var(--chat-charcoal);
        border: 1px solid var(--chat-border);
        color: var(--chat-cream);
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        cursor: pointer;
        transition: all 0.2s;
      }
.call-controls button:hover {
        border-color: var(--chat-gold);
        color: var(--chat-gold);
      }
.call-controls button:last-child {
        background: var(--chat-danger);
        border-color: var(--chat-danger);
      }
.call-controls button:last-child:hover {
        background: #c0392b;
      }

.incoming-call-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--chat-card);
        border: 2px solid var(--chat-gold);
        padding: 32px;
        z-index: 10002;
        text-align: center;
        min-width: 320px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.9);
      }

.incoming-call-modal p {
        font-size: 1.1rem;
        color: var(--chat-cream);
        margin-bottom: 24px;
      }

.incoming-call-modal button {
        padding: 12px 28px;
        margin: 0 8px;
        border: none;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        cursor: pointer;
        transition: all 0.2s;
      }
.incoming-call-modal button:first-of-type {
        background: var(--chat-success);
        color: white;
      }
.incoming-call-modal button:first-of-type:hover {
        background: #229954;
      }
.incoming-call-modal button:last-of-type {
        background: var(--chat-danger);
        color: white;
      }
.incoming-call-modal button:last-of-type:hover {
        background: #c0392b;
      }

.sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);
};

// Réducteur pour la gestion de l'état des appels
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
  useChatStyles();

  // États pour le chat
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // États pour le statut de connexion
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // États des appels gérés par le réducteur
  const [callState, dispatch] = useReducer(callReducer, {
    inCall: false,
    callConnected: false,
    callType: null,
    incomingCall: null,
    localStream: null,
    callDuration: 0,
  });

  // Références pour les éléments DOM et les valeurs persistantes
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const reconnectTimeoutRef = useRef(null);

  // Références pour refléter les états dans les gestionnaires d'événements
  const inCallRef = useRef(callState.inCall);
  const selectedClientIdRef = useRef(selectedClientId);
  const callTypeRef = useRef(callState.callType);
  useEffect(() => { inCallRef.current = callState.inCall; }, [callState.inCall]);
  useEffect(() => { selectedClientIdRef.current = selectedClientId; }, [selectedClientId]);
  useEffect(() => { callTypeRef.current = callState.callType; }, [callState.callType]);

  // Configuration audio avec useRef pour éviter re-création
  const audioRefs = useRef({
    ringtone: null,
    notification: null,
  });

  const SOCKET_SERVER_URL = "https://api.mrrenaudinbarbershop.com";

  // Contraintes média mémorisées
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

  // Initialiser les éléments audio une seule fois
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

    // Capture les refs pour le cleanup
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

  // Déterminer l'ID du partenaire d'appel avec validation
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

  // Faire défiler vers le bas lors de la mise à jour des messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  // Initialiser l'audio avec gestion des erreurs
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

  // Contournement pour l'autoplay sur iOS
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

  // Demander la permission pour les notifications
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

  // Fonctions de contrôle de la sonnerie
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

  // Fonction pour arrêter les pistes média
  const stopMediaTracks = useCallback((stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Piste ${track.kind} arrêtée`);
      });
    }
  }, []);

  // Terminer l'appel avec nettoyage
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

  // Récupérer les messages initiaux depuis Supabase
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

  // Connexion Socket.IO avec logique de reconnexion
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

  // Minuteur d'appel
  const callTimerRef = useRef(null);
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

  // Créer une connexion RTCPeerConnection
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

  // Initier un appel sortant
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

  // Accepter un appel entrant
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

  // Rejeter un appel entrant
  const handleRejectCall = useCallback(() => {
    if (callState.incomingCall) {
      console.log("Rejet de l'appel de :", callState.incomingCall.from);
      socketRef.current?.emit("call_reject", { to: callState.incomingCall.from });
      audioManager.stopRingtone();
      toast.info("Vous avez rejeté l'appel.");
      dispatch({ type: "SET_INCOMING_CALL", payload: null });
    }
  }, [callState.incomingCall, audioManager]);

  // Marquer les messages comme lus
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

  // Basculer la fenêtre de chat
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

  // Basculer la minimisation du chat
  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) =>!prev);
    setIsMaximized(false);
    if (!isMinimized &&!isAdmin) {
      setUnreadCount(0);
      handleMarkMessagesAsRead();
    }
  }, [isMinimized, isAdmin, handleMarkMessagesAsRead]);

  // Basculer maximisation/restauration du chat
  const handleMaximizeToggle = useCallback(() => {
    setIsMaximized((prev) =>!prev);
    setIsMinimized(false);
  }, []);

  // Envoyer un message de chat
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

  // Rendre la liste des clients
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

  // Rendre les messages avec horodatages
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

  // Calculer le total des messages non lus
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