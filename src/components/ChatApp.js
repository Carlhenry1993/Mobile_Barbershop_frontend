import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
          <h2>Une erreur est survenue.</h2>
          <p>{this.state.error?.message || "Veuillez rafraîchir la page."}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const SHOP_INFO = {
  name: "Mr. Renaudin Barbershop",
  email: "mrrenaudinbarber@gmail.com",
  phone: "(819) 555-0199",
  address: "462 4e Rue de la Pointe",
  city: "Shawinigan, QC G9N 1G7",
  website: "https://mrrenaudinbarbershop.com",
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

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const notificationAudioRef = useRef(null);

  const SOCKET_SERVER_URL = "https://api.mrrenaudinbarbershop.com";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  useEffect(() => {
    notificationAudioRef.current = new Audio(
      "https://your-supabase-project.storage.supabase.co/storage/v1/object/public/audio/notification.mp3"
    );

    notificationAudioRef.current.preload = "auto";
  }, []);

  const playNotification = useCallback(() => {
    if (notificationAudioRef.current) {
      notificationAudioRef.current.currentTime = 0;

      notificationAudioRef.current
        .play()
        .catch((err) =>
          console.warn("Échec du son de notification :", err)
        );
    }
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.warn(
            "Échec de la demande de permission de notification :",
            error
          );
        }
      }
    };

    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${SOCKET_SERVER_URL}/api/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP! statut : ${response.status}`);
        }

        const data = await response.json();

        setMessages(
          data.map((msg) => ({
            id: msg.id,
            sender: msg.sender_id === clientId ? "client" : "admin",
            senderId: msg.sender_id,
            message: msg.message,
            timestamp: msg.timestamp,
          }))
        );
      } catch (error) {
        console.error(
          "Erreur lors du chargement des messages :",
          error
        );

        toast.error("Échec du chargement des messages.");
      }
    };

    fetchMessages();
  }, [clientId]);

  useEffect(() => {
    reconnectTimeoutRef.current = null;

    const connectSocket = () => {
      socketRef.current = io(SOCKET_SERVER_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
        transports: ["websocket", "polling"],
        timeout: 10000,
        reconnection: false,
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connecté au serveur :", SOCKET_SERVER_URL);

        setIsConnected(true);
        setReconnectAttempts(0);

        if (isAdmin) {
          socket.emit("admin_status", {
            adminId: clientId,
            online: true,
          });
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket déconnecté :", reason);

        setIsConnected(false);

        if (isAdmin) {
          socket.emit("admin_status", {
            adminId: clientId,
            online: false,
          });
        }

        if (reason !== "io client disconnect") {
          const attempts = reconnectAttempts + 1;

          setReconnectAttempts(attempts);

          const delay = Math.min(
            1000 * Math.pow(2, attempts) + Math.random() * 100,
            30000
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (attempts < 5) {
              connectSocket();
            } else {
              toast.error(
                "Connexion perdue. Veuillez rafraîchir la page."
              );
            }
          }, delay);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Erreur de connexion :", error);
        toast.error("Connexion au serveur impossible.");
      });

      socket.on("new_message", (data) => {
        console.log("Nouveau message reçu :", data);

        const newMessage = {
          id: Date.now() + Math.random(),
          sender: data.sender || "Utilisateur",
          message: data.message,
          senderId: data.senderId,
          timestamp: data.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);

        playNotification();

        if (
          Notification.permission === "granted" &&
          (!isChatOpen || isMinimized)
        ) {
          const notification = new Notification(
            `Message de ${data.sender || "Utilisateur"}`,
            {
              body: data.message,
              icon: "/favicon.ico",
            }
          );

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
          console.log(
            "Liste des clients mise à jour :",
            clientList
          );

          setClients(clientList);
        });
      } else {
        socket.on("admin_status", (data) => {
          console.log(
            "Statut de l'administrateur reçu :",
            data
          );

          setAdminOnline(data.online);
        });
      }
    };

    connectSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [
    isAdmin,
    clientId,
    selectedClientId,
    isChatOpen,
    isMinimized,
    playNotification,
    reconnectAttempts,
  ]);

  const handleMarkMessagesAsRead = useCallback(async () => {
    const targetUserId = isAdmin
      ? selectedClientId
      : clientId;

    if (!targetUserId) return;

    try {
      const response = await fetch(
        `${SOCKET_SERVER_URL}/api/messages/markAsRead`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: targetUserId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur HTTP! statut : ${response.status}`
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors du marquage des messages comme lus :",
        error
      );
    }
  }, [clientId, isAdmin, selectedClientId]);

  const handleChatToggle = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      setIsChatOpen((prev) => !prev);
      setIsMinimized(false);
      setIsMaximized(false);

      if (!isAdmin) {
        setUnreadCount(0);
      } else if (selectedClientId) {
        setUnreadCounts((prev) => {
          const updated = { ...prev };
          delete updated[selectedClientId];
          return updated;
        });
      }

      handleMarkMessagesAsRead();
    },
    [isAdmin, selectedClientId, handleMarkMessagesAsRead]
  );

  const handleMinimizeToggle = useCallback(() => {
    setIsMinimized((prev) => !prev);
    setIsMaximized(false);

    if (!isMinimized && !isAdmin) {
      setUnreadCount(0);
      handleMarkMessagesAsRead();
    }
  }, [isMinimized, isAdmin, handleMarkMessagesAsRead]);

  const handleMaximizeToggle = useCallback(() => {
    setIsMaximized((prev) => !prev);
    setIsMinimized(false);
  }, []);

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    if (isAdmin && !selectedClientId) {
      toast.error("Aucun client sélectionné");
      return;
    }

    if (!isConnected) {
      toast.error("Connexion au serveur impossible");
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
        isAdmin
          ? "send_message_to_client"
          : "send_message_to_admin",
        {
          clientId: selectedClientId,
          message: trimmedMessage,
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "sent" }
            : msg
        )
      );

      setMessage("");
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi du message :",
        error
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "failed" }
            : msg
        )
      );

      toast.error("Échec de l'envoi du message");
    }
  }, [
    message,
    isAdmin,
    selectedClientId,
    isConnected,
  ]);

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

            handleMarkMessagesAsRead();
          }
        }}
        value={selectedClientId || ""}
        className="client-selector"
        disabled={!isConnected}
        aria-label="Sélectionnez un client"
      >
        <option value="">
          Sélectionner un client
        </option>

        {clients.length === 0 ? (
          <option disabled>
            Aucun client en ligne
          </option>
        ) : (
          clients.map((client) => (
            <option
              key={client.id}
              value={client.id}
            >
              {client.name || "Client"}
              {unreadCounts[client.id]
                ? ` (${unreadCounts[client.id]})`
                : ""}
              {client.online ? " 🟢" : " 🔴"}
            </option>
          ))
        )}
      </select>
    ),
    [
      clients,
      selectedClientId,
      unreadCounts,
      isConnected,
      handleMarkMessagesAsRead,
    ]
  );

  const renderMessages = useMemo(() => {
    return (
      <div
        className={`chat-messages ${
          isAdmin ? "admin-view" : "client-view"
        }`}
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>
              Aucun message. Démarrez la conversation.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender} ${
                msg.status || ""
              }`}
            >
              <span className="message-author">
                {msg.sender || "Utilisateur"}:
              </span>

              <p>{msg.message}</p>

              <span className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
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
  }, [messages, isAdmin]);

  const totalUnreadMessages = isAdmin
    ? Object.values(unreadCounts).reduce(
        (a, b) => a + b,
        0
      )
    : unreadCount;

  const ChatFooter = () => (
    <div className="chat-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <strong>{SHOP_INFO.name}</strong>
        </div>

        <div className="footer-info">
          <span>
            📍 {SHOP_INFO.address}, {SHOP_INFO.city}
          </span>

          <span>📞 {SHOP_INFO.phone}</span>

          <span>✉️ {SHOP_INFO.email}</span>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="chat-app">
        {!isChatOpen ? (
          <div className="chat-bubble-container">
            <p className="chat-info">
              Besoin d'aide? Contactez-nous
            </p>

            {!isAdmin && !adminOnline && (
              <p className="admin-offline-notice">
                Notre équipe répondra sous peu
              </p>
            )}

            <button
              type="button"
              className="chat-bubble-icon"
              onClick={handleChatToggle}
              disabled={!isConnected}
              title={
                isConnected
                  ? "Ouvrir le chat"
                  : "Connexion en cours..."
              }
              aria-label={
                isConnected
                  ? "Ouvrir le chat"
                  : "Chat en cours de connexion"
              }
              aria-expanded={isChatOpen}
            >
              💬

              {totalUnreadMessages > 0 && (
                <span
                  className="unread-count"
                  aria-label={`${totalUnreadMessages} messages non lus`}
                >
                  {totalUnreadMessages > 99
                    ? "99+"
                    : totalUnreadMessages}
                </span>
              )}
            </button>
          </div>
        ) : (
          <div
            className={`chat-container ${
              isMinimized ? "minimized" : ""
            } ${isMaximized ? "maximized" : ""}`}
          >
            {isMinimized ? (
              <div className="chat-header minimized">
                <h4>
                  Support - {SHOP_INFO.name}
                </h4>

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
                    title={
                      isMaximized
                        ? "Restaurer"
                        : "Maximiser"
                    }
                    aria-label={
                      isMaximized
                        ? "Restaurer le chat"
                        : "Maximiser le chat"
                    }
                  >
                    {isMaximized ? "🗗" : "🗖"}
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
                    <h4>Support Client</h4>

                    {!isAdmin && (
                      <div className="admin-status">
                        Service client{" "}
                        {adminOnline
                          ? "disponible 🟢"
                          : "indisponible 🔴"}
                      </div>
                    )}
                  </div>

                  <div className="chat-controls">
                    <button
                      className="minimize-button"
                      onClick={handleMinimizeToggle}
                      title="Minimiser"
                      aria-label="Minimiser le chat"
                    >
                      _
                    </button>

                    <button
                      className="maximize-button"
                      onClick={handleMaximizeToggle}
                      title={
                        isMaximized
                          ? "Restaurer"
                          : "Maximiser"
                      }
                      aria-label={
                        isMaximized
                          ? "Restaurer le chat"
                          : "Maximiser le chat"
                      }
                    >
                      {isMaximized ? "🗗" : "🗖"}
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

                {isAdmin && renderClientList()}

                {renderMessages}

                <div className="chat-input">
                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    placeholder="Écrivez votre message..."
                    maxLength={1000}
                    disabled={
                      !isConnected ||
                      (isAdmin && !selectedClientId)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    aria-label="Zone de saisie du message"
                    aria-describedby="chat-input-instructions"
                  />

                  <span
                    id="chat-input-instructions"
                    className="sr-only"
                  >
                    Appuyez sur Entrée pour envoyer.
                    Maj+Entrée pour un saut de ligne.
                  </span>

                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !message.trim() ||
                      !isConnected ||
                      (isAdmin && !selectedClientId)
                    }
                    aria-label="Envoyer le message"
                  >
                    Envoyer
                  </button>
                </div>

                <ChatFooter />
              </>
            )}
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={4000}
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