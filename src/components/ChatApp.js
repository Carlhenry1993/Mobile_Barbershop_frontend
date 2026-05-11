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

// ================= SHOP INFO =================
const SHOP_INFO = {
  name: "Mr. Renaudin Barbershop",
  email: "mrrenaudinbarber@gmail.com",
  phone: "(819) 555-0199",
  address: "462 4e Rue de la Pointe",
  city: "Shawinigan, QC G9N 1G7",
};

const SOCKET_SERVER_URL =
  "https://api.mrrenaudinbarbershop.com";

// ================= COMPONENT =================
const ChatApp = ({ clientId, isAdmin }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] =
    useState(null);

  const [isConnected, setIsConnected] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ================= SCROLL =================
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ================= SOCKET =================
  const connectSocket = useCallback(() => {
    const socket = io(SOCKET_SERVER_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    // CONNECT
    socket.on("connect", () => {
      setIsConnected(true);

      if (isAdmin) {
        socket.emit("admin_status", {
          adminId: clientId,
          online: true,
        });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // MESSAGES
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
    });

    // CLIENT LIST (ADMIN)
    socket.on("update_client_list", (list) => {
      setClients(list);
    });

    // ADMIN STATUS
    socket.on("admin_status", (data) => {
      setAdminOnline(data.online);
    });
  }, [clientId, isAdmin]);

  // INIT SOCKET
  useEffect(() => {
    connectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [connectSocket]);

  // ================= SEND MESSAGE =================
  const handleSendMessage = useCallback(() => {
    const text = message.trim();
    if (!text) return;

    socketRef.current.emit(
      isAdmin
        ? "send_message_to_client"
        : "send_message_to_admin",
      {
        clientId: selectedClientId,
        message: text,
      }
    );

    setMessage("");
  }, [message, isAdmin, selectedClientId]);

  // ================= UI =================
  return (
    <ErrorBoundary>
      <div className="chat-app">
        <div className="chat-box">

          {/* HEADER */}
          <div className="chat-header">
            <h3>{SHOP_INFO.name}</h3>
            <span>
              {isConnected ? "🟢" : "🔴"}
            </span>
          </div>

          {/* ADMIN STATUS (IMPORTANT FIX ICI) */}
          {!isAdmin && (
            <div className="admin-status">
              Service client :{" "}
              {adminOnline
                ? "🟢 Disponible"
                : "🔴 Indisponible"}
            </div>
          )}

          {/* CLIENT SELECT */}
          {isAdmin && (
            <select
              onChange={(e) =>
                setSelectedClientId(e.target.value)
              }
            >
              <option value="">
                Sélectionner client
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* MESSAGES */}
          <div className="messages">
            {messages.map((m) => (
              <div key={m.id}>
                <b>{m.sender}</b>: {m.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="input-box">
            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSendMessage()
              }
              placeholder="Message..."
            />

            <button onClick={handleSendMessage}>
              Envoyer
            </button>
          </div>

        </div>

        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default ChatApp;