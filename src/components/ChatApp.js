import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
// ToastContainer retiré — géré globalement dans App.js
import "./ChatApp.css";

// ─── Error Boundary ────────────────────────────────────────────────────────────
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

// ─── Constants ────────────────────────────────────────────────────────────────
const SHOP_INFO = {
  name: "Mr. Renaudin Barbershop",
  email: "mrrenaudinbarber@gmail.com",
  phone: "(819) 555-0199",
  address: "462 4e Rue de la Pointe",
  city: "Shawinigan, QC G9N 1G7",
};

const SOCKET_SERVER_URL = "https://api.mrrenaudinbarbershop.com";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

/** Beep de notification via Web Audio API */
const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (_) {
    // AudioContext bloqué — ignorer silencieusement
  }
};

/** Couleur HSL déterministe depuis un nom */
const nameToColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 65%, 55%)`;
};

/** Initiales depuis un nom complet */
const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

/** Toast avec avatar coloré + nom + extrait du message */
const NotifToast = ({ senderName, message, isFromOtherClient }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "2px 0" }}>
    <div style={{
      width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0,
      background: nameToColor(senderName),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.75rem", fontWeight: "700", color: "#fff",
      letterSpacing: "0.03em",
    }}>
      {getInitials(senderName)}
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
        <span style={{ fontWeight: "700", fontSize: "0.82rem", color: "#f0ece2" }}>
          {senderName}
        </span>
        {isFromOtherClient && (
          <span style={{
            fontSize: "0.6rem", fontWeight: "600", letterSpacing: "0.08em",
            textTransform: "uppercase", background: "rgba(212,168,67,0.2)",
            color: "#d4a843", padding: "1px 5px", borderRadius: "3px",
          }}>
            autre conv.
          </span>
        )}
      </div>
      <div style={{
        fontSize: "0.78rem", color: "#8e97aa",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px",
      }}>
        {message}
      </div>
    </div>
  </div>
);

/** Flash du titre de l'onglet quand la fenêtre est en arrière-plan */
const useTabFlash = () => {
  const intervalRef    = useRef(null);
  const originalTitle  = useRef(document.title);

  const startFlash = useCallback((label = "💬 Nouveau message!") => {
    if (document.hasFocus()) return;
    let show = true;
    intervalRef.current = setInterval(() => {
      document.title = show ? label : originalTitle.current;
      show = !show;
    }, 1000);
  }, []);

  const stopFlash = useCallback(() => {
    clearInterval(intervalRef.current);
    document.title = originalTitle.current;
  }, []);

  useEffect(() => {
    const stop = () => stopFlash();
    window.addEventListener("focus", stop);
    return () => {
      window.removeEventListener("focus", stop);
      stopFlash();
    };
  }, [stopFlash]);

  return { startFlash };
};

// ─── ChatApp ──────────────────────────────────────────────────────────────────
const ChatApp = ({ isAdmin }) => {
  const currentUser = useRef(getUserFromToken());
  const clientId    = currentUser.current?.id?.toString();

  const [message,          setMessage]          = useState("");
  const [messages,         setMessages]         = useState([]);
  const [clients,          setClients]          = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(
    () => localStorage.getItem("selectedClientId") || null
  );
  const [isConnected,    setIsConnected]    = useState(false);
  const [adminOnline,    setAdminOnline]    = useState(false);
  const [chatState,      setChatState]      = useState(
    () => localStorage.getItem("chatState") || "closed"
  );
  const [unreadCount,    setUnreadCount]    = useState(
    () => Number(localStorage.getItem("unreadCount")) || 0
  );
  const [typingUsers,    setTypingUsers]    = useState({});
  const [connectionError,setConnectionError]= useState(false);

  const socketRef           = useRef(null);
  const messagesEndRef      = useRef(null);
  const typingTimeoutRef    = useRef(null);
  const selectedClientIdRef = useRef(selectedClientId);
  const chatStateRef        = useRef(chatState);
  const { startFlash }      = useTabFlash();

  // ── Sync refs ─────────────────────────────────────────────────────────────
  useEffect(() => { selectedClientIdRef.current = selectedClientId; }, [selectedClientId]);
  useEffect(() => { chatStateRef.current = chatState; },             [chatState]);

  // ── Persister état ────────────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem("chatState",   chatState);           }, [chatState]);
  useEffect(() => { localStorage.setItem("unreadCount", String(unreadCount)); }, [unreadCount]);
  useEffect(() => {
    selectedClientId
      ? localStorage.setItem("selectedClientId", selectedClientId)
      : localStorage.removeItem("selectedClientId");
  }, [selectedClientId]);

  // ── Scroll bas ────────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (chatState === "open") scrollToBottom();
  }, [messages, chatState, scrollToBottom]);

  // ── Charger historique ────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (targetClientId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const query = isAdmin && targetClientId ? `?clientId=${targetClientId}` : "";
      const res   = await fetch(`${SOCKET_SERVER_URL}/api/messages${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unable to load messages");
      setMessages(await res.json());
    } catch (err) {
      console.error("Load messages error:", err);
      toast.error("Erreur chargement historique");
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin && clientId)          fetchMessages();
    else if (isAdmin && selectedClientId) fetchMessages(selectedClientId);
    else if (isAdmin && !selectedClientId) setMessages([]);
  }, [isAdmin, clientId, selectedClientId, fetchMessages]);

  // ── Marquer messages comme lus ────────────────────────────────────────────
  const markVisibleAsRead = useCallback((msgs) => {
    if (!socketRef.current) return;
    const unreadIds = msgs
      .filter((m) => {
        if (m.is_read) return false;
        return isAdmin
          ? m.senderId === selectedClientIdRef.current
          : m.senderId === "admin";
      })
      .map((m) => m.id);

    if (!unreadIds.length) return;
    const to = isAdmin ? selectedClientIdRef.current : "admin";
    socketRef.current.emit("message_read", { messageIds: unreadIds, to });
    setMessages((prev) =>
      prev.map((m) => (unreadIds.includes(m.id) ? { ...m, is_read: true } : m))
    );
  }, [isAdmin]);

  // ── Socket ────────────────────────────────────────────────────────────────
  const connectSocket = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1500,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect",       () => { setIsConnected(true);  setConnectionError(false); });
    socket.on("disconnect",    () =>   setIsConnected(false));
    socket.on("connect_error", (err) => { console.error("Socket error:", err.message); setConnectionError(true); });

    // ── Nouveau message ────────────────────────────────────────────────────
    socket.on("new_message", (data) => {
      const currentSelected  = selectedClientIdRef.current;
      const currentChatState = chatStateRef.current;

      const isRelevantConversation = isAdmin
        ? data.senderId === currentSelected || data.recipientId === currentSelected
        : data.senderId === "admin" || data.recipientId === clientId;

      const isMine = isAdmin
        ? data.senderId === "admin"
        : data.senderId === clientId;

      // ── Message d'une autre conversation (admin) ───────────────────────
      if (!isRelevantConversation && !isMine) {
        setUnreadCount((prev) => prev + 1);
        playNotificationSound();
        startFlash(`💬 ${data.senderName}`);
        toast.info(
          <NotifToast
            senderName={data.senderName}
            message={data.message}
            isFromOtherClient={true}
          />,
          { toastId: `notif-other-${data.id}-${Date.now()}` }
        );
        return;
      }

      // ── Ajouter le message à la conversation courante ──────────────────
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });

      // ── Notifier si le message vient de l'autre partie ─────────────────
      if (!isMine) {
        playNotificationSound();
        startFlash(`💬 ${data.senderName}`);
        toast.info(
          <NotifToast
            senderName={data.senderName}
            message={data.message}
            isFromOtherClient={false}
          />,
          { toastId: `notif-${data.id}-${Date.now()}` }
        );

        if (currentChatState !== "open") {
          // Chat fermé ou minimisé → incrémenter le badge
          setUnreadCount((prev) => prev + 1);
        } else {
          // Chat ouvert → marquer comme lu immédiatement
          socket.emit("message_read", {
            messageIds: [data.id],
            to: isAdmin ? currentSelected : "admin",
          });
          setMessages((prev) =>
            prev.map((m) => (m.id === data.id ? { ...m, is_read: true } : m))
          );
        }
      }
    });

    // ── Liste clients (admin) ──────────────────────────────────────────────
    socket.on("update_client_list", (list) => {
      setClients(list || []);
      if (isAdmin && !selectedClientIdRef.current && list?.length > 0) {
        setSelectedClientId(list[0].id);
      }
    });

    // ── Statut admin (client) ──────────────────────────────────────────────
    socket.on("admin_status", (data) => {
      setAdminOnline(data?.online || false);
    });

    // ── Indicateur de frappe ───────────────────────────────────────────────
    socket.on("typing", ({ from, isTyping }) => {
      const relevant = isAdmin
        ? from === selectedClientIdRef.current
        : from === "admin";
      if (!relevant) return;
      setTypingUsers((prev) => ({ ...prev, [from]: isTyping }));
    });

    // ── Accusés de lecture ─────────────────────────────────────────────────
    socket.on("messages_read", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
        )
      );
    });
  }, [isAdmin, clientId, startFlash]);

  useEffect(() => {
    connectSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
      clearTimeout(typingTimeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions état du chat ──────────────────────────────────────────────────
  const openChat = useCallback(() => {
    setChatState("open");
    setUnreadCount(0);
    setMessages((prev) => { markVisibleAsRead(prev); return prev; });
  }, [markVisibleAsRead]);

  const minimizeChat = useCallback(() => setChatState("minimized"), []);
  const closeChat    = useCallback(() => setChatState("closed"),    []);

  useEffect(() => {
    if (isAdmin && chatState === "open") {
      setMessages((prev) => { markVisibleAsRead(prev); return prev; });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]);

  // ── Envoyer message ───────────────────────────────────────────────────────
  const handleSendMessage = useCallback(() => {
    const text = message.trim();
    if (!text) return;
    if (!socketRef.current || !isConnected) {
      toast.error("Chat déconnecté — veuillez patienter");
      return;
    }

    if (isAdmin) {
      if (!selectedClientId) {
        toast.error("Choisissez un client avant d'envoyer");
        return;
      }
      socketRef.current.emit(
        "send_message_to_client",
        { clientId: selectedClientId, message: text },
        (res) => { if (!res?.success) toast.error("Erreur d'envoi"); }
      );
    } else {
      socketRef.current.emit(
        "send_message_to_admin",
        { message: text },
        (res) => { if (!res?.success) toast.error("Erreur d'envoi"); }
      );
    }

    const to = isAdmin ? selectedClientId : "admin";
    if (to) socketRef.current.emit("typing", { to, isTyping: false });
    clearTimeout(typingTimeoutRef.current);
    setMessage("");
  }, [message, isAdmin, selectedClientId, isConnected]);

  // ── Frappe ────────────────────────────────────────────────────────────────
  const handleTyping = useCallback((value) => {
    setMessage(value);
    if (!socketRef.current) return;
    const to = isAdmin ? selectedClientId : "admin";
    if (!to) return;
    socketRef.current.emit("typing", { to, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", { to, isTyping: false });
    }, 1500);
  }, [isAdmin, selectedClientId]);

  // ── État dérivé ───────────────────────────────────────────────────────────
  const isTypingOther       = Object.values(typingUsers).some(Boolean);
  const selectedClientName  = isAdmin
    ? clients.find((c) => c.id === selectedClientId)?.name || "Client"
    : null;

  if (!currentUser.current) {
    return <div className="chat-auth-required">Veuillez vous connecter</div>;
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <ErrorBoundary>
      <div className="chat-app">
        <div className="chat-bubble-container">

          {/* ── Panneau principal ──────────────────────────────────────── */}
          <div
            className={`chat-container ${chatState}`}
            style={{ display: chatState !== "closed" ? "flex" : "none" }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <span className="chat-header-avatar">✂️</span>
                <div>
                  <div className="chat-header-name">
                    {isAdmin && selectedClientName
                      ? selectedClientName
                      : SHOP_INFO.name}
                  </div>
                  <div className="chat-header-status">
                    <span
                      className="status-dot"
                      style={{ background: isConnected ? "#2ecc71" : "#e74c3c" }}
                    />
                    {connectionError
                      ? "Reconnexion…"
                      : isConnected ? "En ligne" : "Hors ligne"}
                    {!isAdmin && (
                      <span className="admin-status">
                        {" · "}Admin:{" "}
                        {adminOnline ? "Disponible ✅" : "Indisponible"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="chat-action-btn" onClick={minimizeChat} aria-label="Minimiser">–</button>
                <button className="chat-action-btn" onClick={closeChat}    aria-label="Fermer">✕</button>
              </div>
            </div>

            {chatState === "minimized" ? (
              <div className="minimized-bar" onClick={openChat}>
                <span>Cliquez pour agrandir</span>
                {unreadCount > 0 && (
                  <span className="unread-count-inline">{unreadCount}</span>
                )}
              </div>
            ) : (
              <>
                {/* Sélecteur client (admin) */}
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
                          {c.name} {c.online ? "🟢" : "⚫"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Messages */}
                <div className="messages">
                  {messages.length === 0 && (
                    <div className="messages-empty">
                      <div className="messages-empty-icon">✂️</div>
                      <div>
                        {isAdmin && !selectedClientId
                          ? "Sélectionnez un client pour voir la conversation"
                          : "Bonjour! Comment puis-je vous aider?"}
                      </div>
                    </div>
                  )}

                  {messages.map((m, idx) => {
                    const isMine  = isAdmin ? m.senderId === "admin" : m.senderId === clientId;
                    const isLast  = idx === messages.length - 1;
                    const prevMsg = messages[idx - 1];
                    const showTime = !prevMsg
                      || (new Date(m.timestamp) - new Date(prevMsg.timestamp)) > 5 * 60 * 1000;

                    return (
                      <React.Fragment key={m.id}>
                        {showTime && m.timestamp && (
                          <div className="msg-date-divider">
                            {new Date(m.timestamp).toLocaleDateString("fr-CA", {
                              weekday: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                        <div className={`message-bubble ${isMine ? "msg-out" : "msg-in"}`}>
                          {!isMine && (
                            <span className="msg-sender">
                              {m.senderName || (isAdmin ? "Client" : SHOP_INFO.name)}
                            </span>
                          )}
                          <span className="msg-text">{m.message}</span>
                          <div className="msg-meta">
                            {m.timestamp && (
                              <span className="msg-time">
                                {new Date(m.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                            {isMine && isLast && (
                              <span
                                className={`msg-read-receipt ${m.is_read ? "read" : "sent"}`}
                                title={m.is_read ? "Lu" : "Envoyé"}
                              >
                                {m.is_read ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {isTypingOther && (
                    <div className="message-bubble msg-in typing-indicator" aria-label="En train d'écrire">
                      <span /><span /><span />
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="input-box">
                  <input
                    className="chat-input"
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      !isConnected
                        ? "Reconnexion en cours…"
                        : isAdmin && !selectedClientId
                        ? "Sélectionnez un client"
                        : "Votre message…"
                    }
                    disabled={!isConnected || (isAdmin && !selectedClientId)}
                  />
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!isConnected || !message.trim() || (isAdmin && !selectedClientId)}
                    aria-label="Envoyer"
                  >
                    ➤
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Bouton bulle flottante ──────────────────────────────────── */}
          <div className="chat-bubble-wrapper">
            {chatState !== "open" && (
              <div className="chat-bubble-label">Chatter avec nous!</div>
            )}
            <button
              className="chat-bubble-icon"
              onClick={() => chatState !== "open" && openChat()}
              aria-label="Ouvrir le chat"
              style={{ display: chatState === "open" ? "none" : "flex" }}
            >
              💬
              {unreadCount > 0 && (
                <span className="unread-count">{unreadCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ChatApp;