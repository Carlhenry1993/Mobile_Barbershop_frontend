import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "https://api.mrrenaudinbarbershop.com";
const RINGTONE_URL = process.env.NEXT_PUBLIC_RINGTONE_PATH || "/audio/ringtone.mp3";
const NOTIF_URL    = "https://assets.mixkit.co/active_storage/sfx/3007/3007-preview.mp3";
const AUDIO_OPTS   = { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 };
const VIDEO_OPTS   = { ...AUDIO_OPTS, video: { width: { ideal: 1280 }, height: { ideal: 720 } } };

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ChatApp({ clientId, isAdmin }) {
  // — States —
  const [text, setText]      = useState("");
  const [messages, setMessages] = useState([]);
  const [clients, setClients]   = useState([]);
  const [selClient, setSelClient] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [unread, setUnread] = useState(0);

  const [chatOpen, setChatOpen]     = useState(false);
  const [minimized, setMinimized]   = useState(false);
  const [connected, setConnected]   = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);

  const [inCall, setInCall]       = useState(false);
  const [callType, setCallType]   = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [duration, setDuration]   = useState(0);

  // — Refs —
  const socketRef = useRef();
  const pcRef     = useRef();
  const pendingICE = useRef([]);
  const endMsgRef = useRef();
  const localRef  = useRef();
  const remoteRef = useRef();
  const audioRef  = useRef();
  const timerRef  = useRef();
  const ringtone  = useRef(new Audio(RINGTONE_URL));

  // — Helpers —
  const partnerId = () => isAdmin ? selClient : "admin";
  const playSound = url => new Audio(url).play().catch(()=>{});
  const startRing = () => {
    const r = ringtone.current;
    r.loop = true;
    r.play().catch(()=>{});
  };
  const stopRing = () => {
    const r = ringtone.current;
    r.pause();
    r.currentTime = 0;
  };

  // — Effects —  
  // Scroll on new msg
  useEffect(() => endMsgRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // Unlock ringtone (iOS)
  useEffect(() => {
    document.addEventListener("click", startRing, { once: true });
    return () => document.removeEventListener("click", startRing);
  }, []);

  // Call timer
  useEffect(() => {
    if (inCall) {
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [inCall]);

  // Socket.io
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"], auth: { token: localStorage.getItem("token") } });
    socketRef.current = s;

    s.on("connect", () => {
      setConnected(true);
      if (isAdmin) s.emit("admin_status", { adminId: clientId, online: true });
    });
    s.on("disconnect", () => {
      setConnected(false);
      if (isAdmin) s.emit("admin_status", { adminId: clientId, online: false });
      endCall();
    });

    s.on("new_message", data => {
      setMessages(m => [...m, data]);
      playSound(NOTIF_URL);
      if (!chatOpen || minimized) setUnread(u => u + 1);
      if (isAdmin && data.senderId !== selClient) {
        setUnreadCounts(c => ({ ...c, [data.senderId]: (c[data.senderId]||0) + 1 }));
      }
    });
    s.on("update_client_list", list => isAdmin && setClients(list));
    s.on("admin_status", st => !isAdmin && setAdminOnline(st.online));

    s.on("call_offer", offer => { setOfferData(offer); startRing(); });
    s.on("call_answer", ans => {
      pcRef.current?.setRemoteDescription(new RTCSessionDescription(ans));
      pendingICE.current.forEach(c => pcRef.current.addIceCandidate(new RTCIceCandidate(c)));
      pendingICE.current = [];
    });
    s.on("call_candidate", cand => {
      if (pcRef.current?.remoteDescription?.type) pcRef.current.addIceCandidate(new RTCIceCandidate(cand));
      else pendingICE.current.push(cand);
    });
    s.on("call_reject", () => { toast.info("Call rejected"); endCall(); });
    s.on("call_end",   () => { toast.info("Call ended"); endCall(); });

    return () => s.disconnect();
  }, [clientId, isAdmin, chatOpen, minimized, selClient]);

  // — WebRTC setup —
  const endCall = useCallback(() => {
    pcRef.current?.close();
    stopRing();
    localStream?.getTracks().forEach(t => t.stop());
    setLocalStream(null);
    setInCall(false);
    setCallType(null);
    socketRef.current.emit("call_end", { to: partnerId() });
  }, [localStream]);

  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.onicecandidate = e => e.candidate && socketRef.current.emit("call_candidate", { to: partnerId(), candidate: e.candidate });
    pc.onconnectionstatechange = () => {
      if (["connected","completed"].includes(pc.connectionState)) setInCall(true);
      if (["disconnected","failed","closed"].includes(pc.connectionState)) endCall();
    };
    pc.ontrack = ev => {
      const el = ev.track.kind==="audio" ? audioRef.current : remoteRef.current;
      const ms = el.srcObject||new MediaStream();
      ms.addTrack(ev.track);
      el.srcObject = ms;
      el.play().catch(()=>{});
    };
    return pc;
  }, [endCall]);

  // — Actions —
  const sendMessage = () => {
    if (!text.trim()) return toast.error("Empty message");
    if (isAdmin && !selClient) return toast.error("Select a client");
    const payload = { senderId: clientId, sender: isAdmin?"admin":"client", message: text, timestamp: Date.now() };
    setMessages(m => [...m, payload]);
    socketRef.current.emit(isAdmin?"send_message_to_client":"send_message_to_admin", { clientId: selClient, message: text });
    setText("");
  };

  const startCall = async type => {
    if (isAdmin && !selClient) return toast.error("Select a client");
    try {
      const stream = await navigator.mediaDevices.getUserMedia(type==="video" ? VIDEO_OPTS : AUDIO_OPTS);
      setLocalStream(stream);
      if (localRef.current) { localRef.current.srcObject = stream; await localRef.current.play(); }
      pcRef.current = createPeer();
      stream.getTracks().forEach(t => pcRef.current.addTrack(t, stream));
      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      socketRef.current.emit("call_offer", { to: partnerId(), offer, callType: type });
      setCallType(type);
    } catch (err) {
      toast.error("Cannot start call: " + err.message);
    }
  };

  const acceptCall = async () => {
    stopRing();
    try {
      const stream = await navigator.mediaDevices.getUserMedia(offerData.callType==="video" ? VIDEO_OPTS : AUDIO_OPTS);
      setLocalStream(stream);
      if (localRef.current) { localRef.current.srcObject = stream; await localRef.current.play(); }
      pcRef.current = createPeer();
      stream.getTracks().forEach(t => pcRef.current.addTrack(t, stream));
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(offerData.offer));
      const ans = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(ans);
      socketRef.current.emit("call_answer", { to: offerData.from, answer: ans });
      setOfferData(null);
    } catch {
      toast.error("Cannot accept call");
    }
  };

  // — JSX —  
  return (
    <div className="chat-app">
      <ToastContainer position="top-right" autoClose={3000} />
      {!chatOpen
        ? <button className="open-btn" onClick={()=>setChatOpen(true)}>💬{unread>0 && <span className="badge">{unread}</span>}</button>
        : <div className={`window ${minimized?"min":""}`}>
            <header>
              <h3>{isAdmin?"Admin Panel":"Support Chat"}</h3>
              <div>
                <button onClick={()=>setMinimized(m=>!m)}>{minimized?"🗖":"🗕"}</button>
                <button onClick={()=>setChatOpen(false)}>×</button>
              </div>
            </header>
            {!minimized && <>
              {isAdmin && (
                <select value={selClient||""} onChange={e=>{
                  setSelClient(e.target.value);
                  setUnreadCounts(u=>{ const c={...u}; delete c[e.target.value]; return c; });
                }}>
                  <option value="">Select client</option>
                  {clients.map(c=>(
                    <option key={c.id} value={c.id}>
                      {c.name}{unreadCounts[c.id]?" ("+unreadCounts[c.id]+")":""}
                    </option>
                  ))}
                </select>
              )}
              <div className="msgs">
                {messages.map(m=>(
                  <div key={m.timestamp} className={`msg ${m.sender}`}>
                    <b>{m.sender}:</b> {m.message}
                  </div>
                ))}
                <div ref={endMsgRef}/>
              </div>
              <footer>
                <input
                  value={text}
                  onChange={e=>setText(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&sendMessage()}
                  placeholder="Type a message…"
                />
                <button onClick={sendMessage}>Send</button>
                <button onClick={()=>startCall("audio")} aria-label="Audio call">📞</button>
                <button onClick={()=>startCall("video")} aria-label="Video call">📹</button>
              </footer>
            </>}
            {inCall && (
              <div className="call-ui">
                <h4>In {callType} call — {duration}s</h4>
                {callType==="video" && <>
                  <video ref={remoteRef} autoPlay playsInline className="remote"/>
                  <video ref={localRef}  autoPlay muted playsInline className="local"/>
                </>}
                <audio ref={audioRef} autoPlay hidden/>
                <button onClick={endCall}>End Call</button>
              </div>
            )}
            {offerData && (
              <div className="incoming">
                <p>Incoming {offerData.callType} call</p>
                <button onClick={acceptCall}>Accept</button>
                <button onClick={()=>{socketRef.current.emit("call_reject",{to:offerData.from});stopRing();setOfferData(null);}}>Reject</button>
              </div>
            )}
          </div>
      }
    </div>
  );
}
