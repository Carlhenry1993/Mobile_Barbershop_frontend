import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import io from "socket.io-client";
import { ToastContainer } from "react-toastify";
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

const SOCKET_SERVER_URL = "https://api.mrrenaudinbarbershop.com";

// ================= COMPONENT =================
const ChatApp = ({ clientId, isAdmin }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ================= SCROLL =================
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ================= SOCKET =================
  const connectSocket = useCallback(() => {
    const socket = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      if (isAdmin) {
        socket.emit("admin_status", { adminId: clientId, online: true });
      }
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("new_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          sender: data.sender,
          message: data.message,
          timestamp: data.timestamp,
        },
      ]);
      // Increment unread badge when chat is closed
      setIsChatOpen((open) => {
        if (!open) setUnreadCount((n) => n + 1);
        return open;
      });
    });

    socket.on("update_client_list", (list) => setClients(list));
    socket.on("admin_status", (data) => setAdminOnline(data.online));
  }, [clientId, isAdmin]);

  useEffect(() => {
    connectSocket();
    return () => socketRef.current?.disconnect();
  }, [connectSocket]);

  // ================= OPEN / CLOSE =================
  const openChat = useCallback(() => {
    setIsChatOpen(true);
    setUnreadCount(0); // clear badge on open
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  // ================= SEND =================
  const handleSendMessage = useCallback(() => {
    const text = message.trim();
    if (!text) return;

    socketRef.current.emit(
      isAdmin ? "send_message_to_client" : "send_message_to_admin",
      { clientId: selectedClientId, message: text }
    );

    setMessage("");
  }, [message, isAdmin, selectedClientId]);

  // ================= UI =================
  return (
    <ErrorBoundary>
      {/*
        .chat-app must NOT be position:relative/absolute/fixed.
        The floating wrapper below handles all positioning.
      */}
      <div className="chat-app">

        {/* ================= FLOATING WRAPPER ================= */}
        {/* Single fixed anchor — bubble + window stack inside */}
        <div className="chat-bubble-container">

          {/* CHAT WINDOW — always rendered, toggled via CSS */}
          <div
            className="chat-container"
            style={{ display: isChatOpen ? "flex" : "none" }}
          >
            {/* HEADER */}
            <div className="chat-header">
              <div className="chat-header-info">
                <span className="chat-header-avatar">✂️</span>
                <div>
                  <div className="chat-header-name">{SHOP_INFO.name}</div>
                  <div className="chat-header-status">
                    <span
                      className="status-dot"
                      style={{ background: isConnected ? "#2ecc71" : "#e74c3c" }}
                    />
                    {isConnected ? "En ligne" : "Hors ligne"}
                    {!isAdmin && (
                      <span className="admin-status">
                        {" · "}Admin:{" "}
                        {adminOnline ? "Disponible" : "Indisponible"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="chat-close-btn" onClick={closeChat} aria-label="Fermer">
                ✕
              </button>
            </div>

            {/* CLIENT SELECT (admin only) */}
            {isAdmin && (
              <div className="client-select-wrap">
                <select
                  className="client-select"
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

            {/* MESSAGES */}
            <div className="messages">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`message-bubble ${
                    m.sender === clientId ? "msg-out" : "msg-in"
                  }`}
                >
                  <span className="msg-sender">{m.sender}</span>
                  <span className="msg-text">{m.message}</span>
                  {m.timestamp && (
                    <span className="msg-time">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="input-box">
              <input
                className="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Votre message..."
              />
              <button className="send-btn" onClick={handleSendMessage}>
                ➤
              </button>
            </div>
          </div>

          {/* BUBBLE BUTTON */}
          <button
            className="chat-bubble-icon"
            onClick={isChatOpen ? closeChat : openChat}
            aria-label={isChatOpen ? "Fermer le chat" : "Ouvrir le chat"}
          >
            {isChatOpen ? "✕" : "💬"}
            {!isChatOpen && unreadCount > 0 && (
              <span className="unread-count">{unreadCount}</span>
            )}
          </button>

        </div>
        {/* END FLOATING WRAPPER */}

        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default ChatApp;