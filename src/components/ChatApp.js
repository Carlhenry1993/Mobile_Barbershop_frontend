import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChatApp.css";

// ================= ERROR BOUNDARY =================
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Chat Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "#e74c3c" }}>
          <h2>Erreur Chat</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ================= SHOP =================
const SHOP_INFO = {
  name: "Mr. Renaudin Barbershop",
  email: "mrrenaudinbarber@gmail.com",
  phone: "(819) 555-0199",
  address: "462 4e Rue de la Pointe",
  city: "Shawinigan, QC G9N 1G7",
};

// ================= CONFIG =================
const SOCKET_SERVER_URL = "https://api.mrrenaudinbarbershop.com";

// ================= HELPER: GET USER FROM TOKEN =================
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

// ================= COMPONENT =================
const ChatApp = ({ isAdmin }) => {
  const currentUser = useRef(getUserFromToken());
  const clientId = currentUser.current?.id?.toString();

  // ================= STATE =================
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(() => {
    return localStorage.getItem("selectedClientId") || null;
  });
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [chatState, setChatState] = useState(() => {
    return localStorage.getItem("chatState") || "closed";
  });
  const [unreadCount, setUnreadCount] = useState(() => {
    return Number(localStorage.getItem("unreadCount")) || 0;
  });
  const [typingUsers, setTypingUsers] = useState({});

  // ================= REFS =================
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ================= PERSIST STATE =================
  useEffect(() => {
    localStorage.setItem("chatState", chatState);
  }, [chatState]);

  useEffect(() => {
    localStorage.setItem("unreadCount", String(unreadCount));
  }, [unreadCount]);

  useEffect(() => {
    if (selectedClientId) {
      localStorage.setItem("selectedClientId", selectedClientId);
    }
  }, [selectedClientId]);

  // ================= SCROLL =================
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatState === "open") scrollToBottom();
  }, [messages, chatState, scrollToBottom]);

  // ================= LOAD MESSAGES =================
  const fetchMessages = useCallback(async (targetClientId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const query = isAdmin && targetClientId? `?clientId=${targetClientId}` : "";

      const res = await fetch(`${SOCKET_SERVER_URL}/api/messages${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unable to load messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Load messages error:", err);
      toast.error("Erreur chargement historique");
    }
  }, [isAdmin]);

  // Charge historique
  useEffect(() => {
    if (!isAdmin && clientId) fetchMessages();
    if (isAdmin && selectedClientId) fetchMessages(selectedClientId);
    if (isAdmin &&!selectedClientId) setMessages([]); // Vide si aucun client sélectionné
  }, [isAdmin, clientId, selectedClientId, fetchMessages]);

  // ================= SOCKET =================
  const connectSocket = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      toast.error("Connexion chat échouée");
    });

    socket.on("new_message", (data) => {
      // Admin : si aucun client sélectionné, on garde quand même le msg en mémoire
      // mais on n'incrémente unread que si c'est pas le client actuel
      if (isAdmin && selectedClientId) {
        const isRelevant =
          data.senderId === selectedClientId || data.recipientId === selectedClientId;
        if (!isRelevant) {
          // Nouveau msg d'un autre client : juste unread + notif
          setUnreadCount((prev) => prev + 1);
          toast.info(`Nouveau message de ${data.sender}`);
          return;
        }
      }

      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });

      const shouldIncrementUnread =
        chatState!== "open" || (isAdmin && data.senderId!== selectedClientId);

      if (shouldIncrementUnread && data.senderId!== "admin" && data.senderId!== clientId) {
        setUnreadCount((prev) => prev + 1);
      }

      // Auto read si chat ouvert et bon client
      if (chatState === "open" && data.id && (!isAdmin || data.senderId === selectedClientId)) {
        if (data.senderId!== "admin" && data.senderId!== clientId) {
          socket.emit("message_read", {
            messageIds: [data.id],
            to: data.senderId,
          });
        }
      }
    });

    socket.on("update_client_list", (list) => {
      setClients(list || []);
      // Auto-select premier client si aucun sélectionné
      if (isAdmin &&!selectedClientId && list?.length > 0) {
        setSelectedClientId(list[0].id);
      }
    });

    socket.on("admin_status", (data) => {
      setAdminOnline(data?.online || false);
    });

    socket.on("typing", ({ from, isTyping }) => {
      setTypingUsers((prev) => ({...prev, [from]: isTyping }));
    });

    socket.on("messages_read", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id)? {...msg, is_read: true } : msg
        )
      );
    });
  }, [chatState, isAdmin, selectedClientId, clientId]);

  useEffect(() => {
    connectSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
      clearTimeout(typingTimeoutRef.current);
    };
  }, [connectSocket]);

  // ================= CHAT CONTROLS =================
  const openChat = useCallback(() => {
    setChatState("open");
    setUnreadCount(0);
    const unreadIds = messages
    .filter((m) =>!m.is_read && (isAdmin? m.sender === selectedClientId : m.sender === "admin"))
    .map((m) => m.id);
    if (unreadIds.length && socketRef.current) {
      socketRef.current.emit("message_read", {
        messageIds: unreadIds,
        to: isAdmin? selectedClientId : "admin",
      });
    }
  }, [messages, isAdmin, selectedClientId]);

  const minimizeChat = useCallback(() => setChatState("minimized"), []);
  const closeChat = useCallback(() => setChatState("closed"), []);

  // ================= SEND MESSAGE =================
  const handleSendMessage = useCallback(() => {
    const text = message.trim();
    if (!text) return;
    if (!socketRef.current ||!isConnected) {
      toast.error("Chat déconnecté");
      return;
    }

    if (isAdmin) {
      if (!selectedClientId) {
        toast.error("Choisissez un client");
        return;
      }
      socketRef.current.emit(
        "send_message_to_client",
        { clientId: selectedClientId, message: text },
        (response) => {
          if (!response?.success) toast.error("Erreur d'envoi");
        }
      );
    } else {
      socketRef.current.emit(
        "send_message_to_admin",
        { message: text },
        (response) => {
          if (!response?.success) toast.error("Erreur d'envoi");
        }
      );
    }
    setMessage("");
  }, [message, isAdmin, selectedClientId, isConnected]);

  // ================= TYPING =================
  const handleTyping = (value) => {
    setMessage(value);
    if (!socketRef.current) return;
    const to = isAdmin? selectedClientId : "admin";
    if (!to) return;

    socketRef.current.emit("typing", { to, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing", { to, isTyping: false });
    }, 1000);
  };

  if (!currentUser.current) {
    return <div>Veuillez vous connecter</div>;
  }

  // ================= UI =================
  return (
    <ErrorBoundary>
      <div className="chat-app">
        <div className="chat-bubble-container">
          <div
            className={`chat-container ${chatState}`}
            style={{ display: chatState!== "closed"? "flex" : "none" }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <span className="chat-header-avatar">✂️</span>
                <div>
                  <div className="chat-header-name">{SHOP_INFO.name}</div>
                  <div className="chat-header-status">
                    <span
                      className="status-dot"
                      style={{
                        background: isConnected? "#2ecc71" : "#e74c3c",
                      }}
                    />
                    {isConnected? "En ligne" : "Hors ligne"}
                    {!isAdmin && (
                      <span className="admin-status">
                        {" · "}Admin: {adminOnline? "Disponible" : "Indisponible"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="chat-action-btn" onClick={minimizeChat} aria-label="Minimiser">
                  –
                </button>
                <button className="chat-action-btn" onClick={closeChat} aria-label="Fermer">
                  ✕
                </button>
              </div>
            </div>

            {chatState === "minimized"? (
              <div className="minimized-bar" onClick={openChat}>
                <span>Cliquez pour agrandir</span>
                {unreadCount > 0 && (
                  <span className="unread-count-inline">{unreadCount}</span>
                )}
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="client-select-wrap">
                    <select
                      className="client-select"
                      value={selectedClientId || ""}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                    >
                      <option value="">Sélection client</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.online? "🟢" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="messages">
                  {messages.length === 0 && isAdmin &&!selectedClientId && (
                    <div style={{ color: "#94a3b8", textAlign: "center", marginTop: 20 }}>
                      Sélectionnez un client pour voir la conversation
                    </div>
                  )}
                  {messages.map((m) => {
                    const isMine = isAdmin? m.sender === "admin" : m.sender === clientId;
                    return (
                      <div
                        key={m.id}
                        className={`message-bubble ${isMine? "msg-out" : "msg-in"}`}
                      >
                        <span className="msg-sender">
                          {isMine? "Vous" : m.sender === "admin"? "Barbershop" : m.sender}
                        </span>
                        <span className="msg-text">{m.message}</span>
                        {m.timestamp && (
                          <span className="msg-time">
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {m.is_read && isMine && " ✓✓"}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {Object.values(typingUsers).includes(true) && (
                    <div className="message-bubble msg-in typing-indicator">
                      <span></span><span></span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="input-box">
                  <input
                    className="chat-input"
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder={isAdmin &&!selectedClientId? "Sélectionnez un client" : "Votre message..."}
                    disabled={isAdmin &&!selectedClientId}
                  />
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={isAdmin &&!selectedClientId}
                  >
                    ➤
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            className="chat-bubble-icon"
            onClick={() => {
              if (chatState === "closed") openChat();
              else if (chatState === "minimized") openChat();
            }}
            aria-label="Ouvrir le chat"
            style={{ display: chatState === "open"? "none" : "flex" }}
          >
            💬
            {chatState!== "open" && unreadCount > 0 && (
              <span className="unread-count">{unreadCount}</span>
            )}
          </button>
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </ErrorBoundary>
  );
};

export default ChatApp;