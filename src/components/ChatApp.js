import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Audio de notification pour les messages
const notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3");
// Audio pour la sonnerie des appels entrants (remplacez l'URL par celle d'une sonnerie adaptée)
const ringtoneAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/3872/3872-preview.mp3");

const SOCKET_SERVER_URL = "https://mobile-barbershop-backend.onrender.com";

const ChatApp = ({ clientId, isAdmin }) => {
  // États du chat
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // États d'appel
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null); // "audio" ou "video"
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Références
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Fonction pour arrêter la sonnerie
  const stopRingtone = () => {
    ringtoneAudio.pause();
    ringtoneAudio.currentTime = 0;
  };

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem("token") },
    });
    newSocket.on("connect", () => {
      console.log("Connecté au serveur WebSocket.");
    });

    newSocket.on("new_message", (data) => {
      console.log("Nouveau message reçu :", data);
      setMessages((prev) => [
        ...prev,
        { sender: data.sender === "admin" ? "admin" : "client", message: data.message },
      ]);
      notificationAudio.play().catch((error) => console.error("Erreur audio :", error));

      if (typeof Notification !== "undefined") {
        if (Notification.permission === "granted") {
          new Notification(`Message de ${data.sender}`, { body: data.message });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification(`Message de ${data.sender}`, { body: data.message });
            }
          });
        }
      } else {
        toast.info(`Nouveau message de ${data.sender}: ${data.message}`);
      }
      if (!isChatOpen || isMinimized) setUnreadCount((prev) => prev + 1);
    });

    if (isAdmin) {
      newSocket.on("update_client_list", (clients) => {
        console.log("Liste clients mise à jour :", clients);
        setClients(clients);
      });
    }

    // Gestion des événements de signalisation WebRTC

    newSocket.on("call_offer", async (data) => {
      console.log("Offre d'appel reçue :", data);
      if (inCall) {
        newSocket.emit("call_reject", { to: data.from });
        return;
      }
      setIncomingCall({ from: data.from, callType: data.callType, offer: data.offer });
      // Démarrer la sonnerie pour signaler l'appel entrant
      ringtoneAudio.loop = true;
      ringtoneAudio.play().catch((error) => console.error("Erreur de sonnerie :", error));
    });

    newSocket.on("call_answer", async (data) => {
      console.log("Réponse d'appel reçue :", data);
      if (pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
          console.error("Erreur lors de la définition de la description distante :", error);
        }
      }
    });

    newSocket.on("call_candidate", async (data) => {
      console.log("ICE candidate reçue :", data);
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error("Erreur lors de l'ajout de l'ICE candidate :", error);
        }
      }
    });

    newSocket.on("call_reject", (data) => {
      console.log("Appel rejeté :", data);
      alert("L'appel a été rejeté par le destinataire.");
      stopRingtone();
      endCall();
    });

    newSocket.on("call_end", (data) => {
      console.log("Appel terminé :", data);
      stopRingtone();
      endCall();
    });

    setSocket(newSocket);
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    return () => {
      newSocket.disconnect();
    };
  }, [isAdmin, inCall, isChatOpen, isMinimized]);

  const getCallPartnerId = () => (isAdmin ? selectedClientId : "admin");
  const getMediaConstraints = (type) =>
    type === "audio" ? { audio: true, video: false } : { audio: true, video: true };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call_candidate", { to: getCallPartnerId(), candidate: event.candidate });
      }
    };
    pc.ontrack = (event) => {
      console.log("Piste distante reçue :", event);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current && callType === "video") {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };
    pc.onconnectionstatechange = () => {
      console.log("État de la connexion :", pc.connectionState);
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        stopRingtone();
        endCall();
      }
    };
    return pc;
  };

  const initiateCall = async (type) => {
    if (isAdmin && !selectedClientId) {
      alert("Veuillez sélectionner un client pour appeler.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(getMediaConstraints(type));
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
      console.error("Erreur lors de l'initiation de l'appel :", error);
      alert("Erreur lors de l'initiation de l'appel. Vérifiez vos autorisations (HTTPS requis).");
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    stopRingtone();
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
      console.error("Erreur lors de l'acceptation de l'appel :", error);
      alert("Erreur lors de l'acceptation de l'appel.");
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      socket.emit("call_reject", { to: incomingCall.from });
      stopRingtone();
      setIncomingCall(null);
    }
  };

  const endCall = () => {
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
    stopRingtone();
    if (socket) {
      socket.emit("call_end", { to: getCallPartnerId() });
    }
  };

  const markMessagesAsRead = useCallback(async () => {
    try {
      await fetch("/api/messages/markAsRead", {
        method: "PUT",
        body: JSON.stringify({ userId: isAdmin ? selectedClientId : clientId }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Erreur lors du marquage des messages :", error);
    }
  }, [clientId, isAdmin, selectedClientId]);

  const handleChatToggle = useCallback(() => {
    setIsChatOpen((prev) => !prev);
    setIsMinimized(false);
    setUnreadCount(0);
    markMessagesAsRead();
  }, [markMessagesAsRead]);

  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) => !prev);
    if (!isMinimized) setUnreadCount(0);
  }, [isMinimized]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) {
      alert("Le message est vide !");
      return;
    }
    if (isAdmin) {
      if (!selectedClientId) {
        alert("Aucun client sélectionné.");
        return;
      }
      socket.emit("send_message_to_client", { clientId: selectedClientId, message });
    } else {
      socket.emit("send_message_to_admin", { message });
    }
    setMessages((prev) => [...prev, { sender: isAdmin ? "admin" : "client", message }]);
    setMessage("");
  }, [message, socket, isAdmin, selectedClientId]);

  const renderClientList = () => (
    <select onChange={(e) => setSelectedClientId(e.target.value)} value={selectedClientId || ""} className="client-selector">
      <option value="">Sélectionnez un client</option>
      {clients.length === 0 ? (
        <option disabled>Aucun client connecté</option>
      ) : (
        clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name || `Client ${client.id}`}
          </option>
        ))
      )}
    </select>
  );

  return (
    <div className="chat-app">
      {!isChatOpen ? (
        <>
          <p className="chat-info">Chatter avec nous !</p>
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
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tapez votre message..." />
                <button onClick={handleSendMessage}>Envoyer</button>
              </div>
            </>
          )}
        </div>
      )}

      {inCall && (
        <div className="call-container">
          <h4>Appel en cours ({callType === "audio" ? "Vocal" : "Vidéo"})</h4>
          {callType === "video" && (
            <div className="video-container">
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
              <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
            </div>
          )}
          {callType === "audio" && <p>Appel vocal en cours...</p>}
          <button onClick={endCall}>Terminer l'appel</button>
        </div>
      )}

      {incomingCall && (
        <div className="incoming-call-modal">
          <p>
            Appel entrant de {incomingCall.from} (
            {incomingCall.callType === "audio" ? "Vocal" : "Vidéo"})
          </p>
          <button onClick={handleAcceptCall}>Accepter</button>
          <button onClick={handleRejectCall}>Refuser</button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ChatApp;
