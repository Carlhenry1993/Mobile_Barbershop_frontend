import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Short sound notification
const notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3");

const SOCKET_SERVER_URL = "https://mobile-barbershop-backend.onrender.com";

const ChatApp = ({ clientId, isAdmin }) => {
  // Chat-related state
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Call-related state
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null); // "audio" or "video"
  const [incomingCall, setIncomingCall] = useState(null); // { from, callType, offer }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Refs for UI elements and peer connection
  const messagesEndRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  // Socket instance
  const [socket, setSocket] = useState(null);

  // Auto-scroll chat to bottom when messages update
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
      console.log("Connected to WebSocket server.");
    });

    // Handle incoming text messages
    newSocket.on("new_message", (data) => {
      console.log("New message received:", data);
      setMessages((prev) => [
        ...prev,
        { sender: data.sender === "admin" ? "admin" : "client", message: data.message },
      ]);

      // Play sound notification
      notificationAudio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });

      // Browser notification (with fallback to toast)
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

      // Increment unread count if chat is closed or minimized
      if (!isChatOpen || isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // For admins, update connected client list
    if (isAdmin) {
      newSocket.on("update_client_list", (clients) => {
        console.log("Updated client list:", clients);
        setClients(clients);
      });
    }

    // --- Call Signaling Events ---

    // Receiving a call offer
    newSocket.on("call_offer", async (data) => {
      // data: { from, callType, offer }
      console.log("Received call offer:", data);
      if (inCall) {
        // Already in a call: auto-reject
        newSocket.emit("call_reject", { to: data.from });
        return;
      }
      setIncomingCall({ from: data.from, callType: data.callType, offer: data.offer });
    });

    // Receiving a call answer
    newSocket.on("call_answer", async (data) => {
      console.log("Received call answer:", data);
      if (pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
          console.error("Error setting remote description from answer:", error);
        }
      }
    });

    // Receiving ICE candidates from remote peer
    newSocket.on("call_candidate", async (data) => {
      console.log("Received ICE candidate:", data);
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error("Error adding ICE candidate", error);
        }
      }
    });

    // When remote rejects the call
    newSocket.on("call_reject", (data) => {
      console.log("Call rejected by remote:", data);
      alert("L'appel a été rejeté par le destinataire.");
      endCall();
    });

    // When remote ends the call
    newSocket.on("call_end", (data) => {
      console.log("Call ended by remote:", data);
      endCall();
    });

    setSocket(newSocket);

    // Request notification permission if needed
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      newSocket.disconnect();
    };
  }, [isAdmin, inCall, isChatOpen, isMinimized]);

  // Helper: determine the call partner ID
  const getCallPartnerId = () => {
    if (isAdmin) {
      return selectedClientId;
    } else {
      return "admin"; // For example, admin can be identified by "admin"
    }
  };

  // Return media constraints based on call type
  const getMediaConstraints = (type) => {
    return type === "audio" ? { audio: true, video: false } : { audio: true, video: true };
  };

  // Create and configure a new RTCPeerConnection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call_candidate", { to: getCallPartnerId(), candidate: event.candidate });
      }
    };
    pc.ontrack = (event) => {
      console.log("Received remote track:", event);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current && callType === "video") {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };
    pc.onconnectionstatechange = () => {
      console.log("Peer connection state:", pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        endCall();
      }
    };
    return pc;
  };

  // Initiate a call (audio or video)
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
      alert("Erreur lors de l'initiation de l'appel.");
    }
  };

  // Accept an incoming call offer
  const handleAcceptCall = async () => {
    if (!incomingCall) return;
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

  // Reject an incoming call offer
  const handleRejectCall = () => {
    if (incomingCall) {
      socket.emit("call_reject", { to: incomingCall.from });
      setIncomingCall(null);
    }
  };

  // End an ongoing call
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
    if (socket) {
      socket.emit("call_end", { to: getCallPartnerId() });
    }
  };

  // Mark messages as read (could be replaced with an API call)
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

  // Toggle chat window open/close
  const handleChatToggle = useCallback(() => {
    setIsChatOpen((prev) => !prev);
    setIsMinimized(false);
    setUnreadCount(0);
    markMessagesAsRead();
  }, [markMessagesAsRead]);

  // Toggle chat minimization
  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) => !prev);
    if (!isMinimized) {
      setUnreadCount(0);
    }
  }, [isMinimized]);

  // Send a text message
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

  // Render the client list for admin users
  const renderClientList = () => (
    <select
      onChange={(e) => setSelectedClientId(e.target.value)}
      value={selectedClientId || ""}
      className="client-selector"
    >
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
      {/* Chat Interface */}
      {!isChatOpen ? (
        <>
          <p className="chat-info">Chatter avec nous !</p>
          <button className="chat-bubble-icon" onClick={handleChatToggle}>
            💬
            {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
          </button>
        </>
      ) : (
        <div className={`chat-container ${isMinimized ? "minimized" : ""}`}>
          <div className="chat-header">
            <h4>Chat {isAdmin ? "Admin" : "Client"}</h4>
            <div className="chat-controls">
              <button className="minimize-button" onClick={handleMinimizeToggle}>
                {isMinimized ? "🗖" : "__"}
              </button>
              <button className="close-button" onClick={handleChatToggle}>
                X
              </button>
            </div>
          </div>
          {!isMinimized && (
            <>
              {isAdmin && renderClientList()}
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender === (isAdmin ? "admin" : "client") ? "sender" : "receiver"
                    }`}
                  >
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
                  placeholder="Tapez votre message..."
                />
                <button onClick={handleSendMessage}>Envoyer</button>
              </div>
              {/* Buttons for initiating calls */}
              <div className="call-buttons">
                <button onClick={() => initiateCall("audio")}>Appel Vocal</button>
                <button onClick={() => initiateCall("video")}>Appel Vidéo</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Active Call UI */}
      {inCall && (
        <div className="call-container">
          <h4>
            Appel en cours ({callType === "audio" ? "Vocal" : "Vidéo"})
          </h4>
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

      {/* Incoming Call Modal */}
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
