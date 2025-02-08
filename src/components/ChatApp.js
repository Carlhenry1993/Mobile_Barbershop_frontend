import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Notification sonore courte
const notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3");

const SOCKET_SERVER_URL = "https://mobile-barbershop-backend.onrender.com";

const ChatApp = ({ clientId, isAdmin }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Suivi des messages non lus
  const messagesEndRef = useRef(null);

  // Défilement automatique vers le bas des messages
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

    // Réception d'un nouveau message
    newSocket.on("new_message", (data) => {
      console.log("Nouveau message reçu :", data);

      setMessages((prev) => [
        ...prev,
        { sender: data.sender === "admin" ? "admin" : "client", message: data.message },
      ]);

      // Lecture de la notification sonore
      notificationAudio.play().catch((error) => {
        console.error("Erreur lors de la lecture du son :", error);
      });

      // Gestion des notifications
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
        // Fallback pour les environnements qui ne supportent pas Notification (ex. iOS)
        toast.info(`Nouveau message de ${data.sender}: ${data.message}`);
      }

      // Incrémente le compteur des messages non lus si le chat est fermé ou minimisé
      if (!isChatOpen || isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    if (isAdmin) {
      // Mise à jour de la liste des clients pour l'admin
      newSocket.on("update_client_list", (clients) => {
        console.log("Liste des clients mise à jour :", clients);
        setClients(clients);
      });
    }

    setSocket(newSocket);

    // Demander la permission des notifications si l'objet Notification est disponible
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      newSocket.disconnect();
    };
  }, [isAdmin, isChatOpen, isMinimized]);

  // Marquer les messages comme lus (envoi d'une requête API)
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

  // Bascule de l'affichage du chat
  const handleChatToggle = useCallback(() => {
    setIsChatOpen((prev) => !prev);
    setIsMinimized(false); // Réouverture complète
    setUnreadCount(0); // Réinitialise le compteur non lu
    markMessagesAsRead();
  }, [markMessagesAsRead]);

  // Minimisation du chat
  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) => !prev);
    if (!isMinimized) {
      setUnreadCount(0);
    }
  }, [isMinimized]);

  // Envoi du message
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

  // Rendu de la liste des clients pour l'admin
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
    <>
      {/* Bulle de chat non ouverte */}
      {!isChatOpen ? (
        <>
          <p className="chat-info">Chatter avec nous !</p>
          <button className="chat-bubble-icon" onClick={handleChatToggle}>
            💬
            {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
          </button>
        </>
      ) : (
        // Chat ouvert
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
                    className={`message ${msg.sender === (isAdmin ? "admin" : "client") ? "sender" : "receiver"}`}
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
            </>
          )}
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
    </>
  );
};

export default ChatApp;
