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

// ================= COMPONENT =================
const ChatApp = ({ clientId, isAdmin }) => {
  // ================= STATE =================
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [chatState, setChatState] = useState("closed"); // closed | minimized | open
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState({});

  // ================= REFS =================
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ================= SCROLL =================
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatState === "open") scrollToBottom();
  }, [messages, chatState, scrollToBottom]);

  // ================= LOAD OLD MESSAGES =================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${SOCKET_SERVER_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unable to load messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Load messages error:", err);
      }
    };
    fetchMessages();
  }, []);

  // ================= SOCKET =================
  const connectSocket = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Missing auth token");
      return;
    }

    const socket = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      toast.error("Connexion chat échouée");
    });

    socket.on("new_message", (data) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [
         ...prev,
          {
            id: data.id || Date.now() + Math.random(),
            sender: data.senderId || data.sender,
            senderName: data.sender,
            recipientId: data.recipientId,
            message: data.message,
            timestamp: data.timestamp,
            read: data.read,
          },
        ];
      });

      if (chatState!== "open") {
        setUnreadCount((prev) => prev + 1);
      }

      if (chatState === "open" && data.id) {
        socket.emit("message_read", {
          messageIds: [data.id],
          to: data.senderId === "admin"? "admin" : data.senderId,
        });
      }
    });

    socket.on("update_client_list", (list) => {
      setClients(list || []);
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
          messageIds.includes(msg.id)? {...msg, read: true } : msg
        )
      );
    });
  }, [chatState]);

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
  }, []);

  const minimizeChat = useCallback(() => {
    setChatState("minimized");
  }, []);

  const closeChat = useCallback(() => {
    setChatState("closed");
  }, []);

  // ================= SEND MESSAGE =================
  const handleSendMessage = useCallback(() => {
    const text = message.trim();
    if (!text) return;
    if (!socketRef.current ||!isConnected) {
      toast.error("Chat déconnecté");
      return;
    }

    const addMessageToState = (saved, sender, senderName, recipientId) => {
      setMessages((prev) => [
       ...prev,
        {
          id: saved.id,
          sender,
          senderName,
          recipientId,
          message: saved.message,
          timestamp: saved.timestamp,
          read: saved.is_read,
        },
      ]);
    };

    if (isAdmin) {
      if (!selectedClientId) {
        toast.error("Choisissez un client");
        return;
      }
      socketRef.current.emit(
        "send_message_to_client",
        { clientId: selectedClientId, message: text },
        (response) => {
          if (!response?.success) {
            toast.error("Erreur d'envoi");
            return;
          }
          addMessageToState(response.message, "admin", "admin", selectedClientId);
        }
      );
    } else {
      socketRef.current.emit(
        "send_message_to_admin",
        { message: text },
        (response) => {
          if (!response?.success) {
            toast.error("Erreur d'envoi");
            return;
          }
          addMessageToState(response.message, clientId, "Vous", "admin");
        }
      );
    }
    setMessage("");
  }, [message, isAdmin, selectedClientId, clientId, isConnected]);

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

  // ================= FILTERED MESSAGES =================
  const filteredMessages =
    isAdmin && selectedClientId
     ? messages.filter(
          (m) => m.sender === selectedClientId || m.recipientId === selectedClientId
        )
      : messages;

  const isChatVisible = chatState!== "closed";

  // ================= UI =================
  return (
    <ErrorBoundary>
      <div className="chat-app">
        <div className="chat-bubble-container">
          {/* ================= CHAT WINDOW ================= */}
          <div
            className={`chat-container ${chatState}`}
            style={{ display: isChatVisible? "flex" : "none" }}
          >
            {/* ================= HEADER ================= */}
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
                <button
                  className="chat-action-btn"
                  onClick={minimizeChat}
                  aria-label="Minimiser"
                >
                  –
                </button>
                <button
                  className="chat-action-btn"
                  onClick={closeChat}
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ================= MINIMIZED BAR ================= */}
            {chatState === "minimized"? (
              <div className="minimized-bar" onClick={openChat}>
                <span>Cliquez pour agrandir</span>
                {unreadCount > 0 && (
                  <span className="unread-count-inline">{unreadCount}</span>
                )}
              </div>
            ) : (
              <>
                {/* ================= CLIENT SELECT ================= */}
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
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* ================= MESSAGES ================= */}
                <div className="messages">
                  {filteredMessages.map((m) => {
                    const isMine = isAdmin? m.sender === "admin" : m.sender === clientId;
                    return (
                      <div
                        key={m.id}
                        className={`message-bubble ${isMine? "msg-out" : "msg-in"}`}
                      >
                        <span className="msg-sender">
                          {m.senderName || m.sender}
                        </span>
                        <span className="msg-text">{m.message}</span>
                        {m.timestamp && (
                          <span className="msg-time">
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {m.read && isMine && " ✓✓"}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {Object.values(typingUsers).includes(true) && (
                    <div className="message-bubble msg-in typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* ================= INPUT ================= */}
                <div className="input-box">
                  <input
                    className="chat-input"
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Votre message..."
                  />
                  <button className="send-btn" onClick={handleSendMessage}>
                    ➤
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ================= FLOAT BUTTON ================= */}
          <button
            className="chat-bubble-icon"
            onClick={chatState === "closed"? openChat : closeChat}
            aria-label={isChatVisible? "Fermer le chat" : "Ouvrir le chat"}
          >
            {isChatVisible? "✕" : "💬"}
            {chatState === "closed" && unreadCount > 0 && (
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