import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import apiClient from "../lib/apiClient";
// ToastContainer géré globalement dans App.js
import ChatApp from "../components/ChatApp";

const useAdminStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-admin-dashboard-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
.ad-root {
  --ab-black: #0e1015; --ab-charcoal: #161b24; --ab-card: #1e2535;
  --ab-border: #2a3348; --ab-gold: #d4a843; --ab-gold-lt: #f0c96a;
  --ab-steel: #8ba8c8; --ab-cream: #eef2f7; --ab-light: #b8c8da;
  --ab-muted: #7888a0; --ab-danger: #e74c3c; --ab-success: #27ae60;
  --ab-warning: #f39c12;
  background: var(--ab-black); color: var(--ab-cream);
  font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased;
  min-height: 100svh; display: flex;
}
.ad-sidebar {
  width: 260px; background: var(--ab-charcoal);
  border-right: 1px solid var(--ab-border);
  padding: 2rem 0; flex-shrink: 0;
  position: fixed; left: 0; top: 0; bottom: 0;
  overflow-y: auto; z-index: 100; transition: transform 0.3s;
}
.ad-logo { padding: 0 1.5rem 2rem; border-bottom: 1px solid var(--ab-border); margin-bottom: 2rem; }
.ad-logo-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 900; color: var(--ab-gold); margin-bottom: 0.25rem; }
.ad-logo-sub { font-size: 0.7rem; color: var(--ab-muted); text-transform: uppercase; letter-spacing: 0.15em; }
.ad-nav { padding: 0 1rem; }
.ad-nav-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem 1rem; margin-bottom: 0.25rem; border-radius: 8px;
  color: var(--ab-light); font-size: 0.9rem; font-weight: 500;
  cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
}
.ad-nav-item:hover { background: rgba(212,168,67,0.08); color: var(--ab-gold-lt); }
.ad-nav-item.active { background: rgba(212,168,67,0.12); color: var(--ab-gold); border-color: rgba(212,168,67,0.3); }
.ad-nav-icon { font-size: 1.1rem; width: 20px; }
.ad-content { flex: 1; margin-left: 260px; padding: 2rem; min-height: 100vh; }
.ad-mobile-toggle {
  display: none; position: fixed; top: 1rem; left: 1rem; z-index: 101;
  background: var(--ab-gold); color: var(--ab-black); border: none;
  width: 48px; height: 48px; border-radius: 12px; font-size: 1.5rem; cursor: pointer;
}
.ad-header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--ab-border); }
.ad-eyebrow { font-size: 0.68rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--ab-gold); margin-bottom: 0.5rem; }
.ad-display { font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--ab-cream); line-height: 1.1; }
.ab-gold-rule { display: block; width: 60px; height: 2px; background: var(--ab-gold); margin: 1rem 0 0; }
.ab-btn-gold, .ab-btn-outline, .ab-btn-danger {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  font-weight: 500; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.75rem 1.5rem; border: none; cursor: pointer; transition: all 0.2s;
}
.ab-btn-gold { background: var(--ab-gold); color: var(--ab-black); }
.ab-btn-gold:hover { background: var(--ab-gold-lt); }
.ab-btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
.ab-btn-outline { background: transparent; color: var(--ab-cream); border: 1px solid var(--ab-border); }
.ab-btn-outline:hover { border-color: var(--ab-gold); color: var(--ab-gold); }
.ab-btn-danger { background: var(--ab-danger); color: #fff; }
.ab-btn-danger:hover { background: #c0392b; }
.ab-filters {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem; margin-bottom: 2rem; padding: 1.5rem;
  background: var(--ab-card); border: 1px solid var(--ab-border);
}
.ab-input, .ab-select {
  width: 100%; background: var(--ab-black); border: 1px solid var(--ab-border);
  color: var(--ab-cream); font-size: 0.9rem; padding: 0.75rem 1rem;
  transition: border-color 0.3s; font-family: 'DM Sans', sans-serif;
}
.ab-input:focus, .ab-select:focus { outline: none; border-color: var(--ab-gold); }
.ab-label { color: var(--ab-light); font-size: 0.8rem; font-weight: 500; margin-bottom: 0.5rem; display: block; }
.ab-table { width: 100%; background: var(--ab-card); border: 1px solid var(--ab-border); border-collapse: collapse; }
.ab-table th {
  background: var(--ab-charcoal); color: var(--ab-gold);
  font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;
  padding: 1rem; text-align: left; border-bottom: 1px solid var(--ab-border);
}
.ab-table td { padding: 1rem; border-bottom: 1px solid var(--ab-border); font-size: 0.9rem; color: var(--ab-light); }
.ab-table tr:hover { background: rgba(212,168,67,0.04); }
.ab-status { display: inline-block; padding: 0.25rem 0.75rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
.ab-status.confirmed { background: rgba(39,174,96,0.15); color: var(--ab-success); border: 1px solid rgba(39,174,96,0.3); }
.ab-status.cancelled { background: rgba(231,76,60,0.15); color: var(--ab-danger); border: 1px solid rgba(231,76,60,0.3); }
.ab-status.completed { background: rgba(139,168,200,0.15); color: var(--ab-steel); border: 1px solid rgba(139,168,200,0.3); }
.ab-actions { display: flex; gap: 0.5rem; }
.ab-icon-btn {
  background: transparent; border: 1px solid var(--ab-border); color: var(--ab-muted);
  padding: 0.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.85rem;
}
.ab-icon-btn:hover { border-color: var(--ab-gold); color: var(--ab-gold); }
.ab-icon-btn.danger:hover { border-color: var(--ab-danger); color: var(--ab-danger); }
.ab-icon-btn.success:hover { border-color: var(--ab-success); color: var(--ab-success); }
.ab-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.82);
  z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.ab-modal {
  background: var(--ab-card); border: 1px solid var(--ab-border);
  padding: 2rem; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;
}
.ab-modal h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--ab-cream); margin-bottom: 1.5rem; }
.ab-modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; color: var(--ab-muted);
  font-size: 1.3rem; cursor: pointer; transition: color 0.2s;
}
.ab-modal-close:hover { color: var(--ab-cream); }
.ab-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.ab-stat-card { background: var(--ab-card); border: 1px solid var(--ab-border); padding: 1.5rem; transition: border-color 0.25s; }
.ab-stat-card:hover { border-color: rgba(212,168,67,0.3); }
.ab-stat-label { color: var(--ab-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
.ab-stat-value { color: var(--ab-cream); font-size: 2rem; font-weight: 700; font-family: 'Playfair Display', serif; }
.ab-stat-sub { font-size: 0.75rem; color: var(--ab-muted); margin-top: 0.25rem; }
.ab-empty { text-align: center; padding: 4rem 2rem; color: var(--ab-muted); }
.ab-error { background: rgba(231,76,60,0.1); border: 1px solid rgba(231,76,60,0.3); color: #ff8a7a; padding: 1rem; font-size: 0.85rem; margin-bottom: 1.5rem; }
.ad-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; }
/* Client info panel */
.ab-client-panel { background: var(--ab-charcoal); border: 1px solid var(--ab-border); padding: 1.5rem; margin-bottom: 1.5rem; }
.ab-client-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--ab-cream); margin-bottom: 0.5rem; }
.ab-client-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-size: 0.85rem; color: var(--ab-light); }
/* Summary rows */
.ab-summary-row { display: flex; justify-content: space-between; padding: 0.55rem 0; border-bottom: 1px solid var(--ab-border); font-size: 0.88rem; }
.ab-summary-row:last-child { border-bottom: none; }
/* Search */
.ab-search-wrap { position: relative; }
.ab-search-wrap input { padding-left: 2.2rem; }
.ab-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--ab-muted); font-size: 0.9rem; pointer-events: none; }
/* Policy notice */
.ab-policy-notice {
  background: rgba(212,168,67,0.06); border-left: 2px solid var(--ab-gold);
  padding: 0.85rem 1.25rem; font-size: 0.8rem; color: var(--ab-muted);
  line-height: 1.6; margin-bottom: 1.5rem;
}
.ab-dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr); gap: 1rem; align-items: start; }
.ab-panel { background: var(--ab-card); border: 1px solid var(--ab-border); padding: 1.5rem; }
.ab-panel-title { color: var(--ab-cream); font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
.ab-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(155px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
.ab-kpi { background: var(--ab-charcoal); border: 1px solid var(--ab-border); padding: 1rem; }
.ab-kpi strong { color: var(--ab-cream); display: block; font-size: 1.5rem; font-family: 'Playfair Display', serif; }
.ab-kpi span { color: var(--ab-muted); display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.09em; margin-top: 0.25rem; }
.ab-list { display: grid; gap: 0.7rem; }
.ab-list-item { border: 1px solid var(--ab-border); background: var(--ab-black); padding: 0.9rem; display: grid; gap: 0.35rem; }
.ab-list-main { display: flex; justify-content: space-between; gap: 1rem; color: var(--ab-cream); font-weight: 700; }
.ab-list-meta { color: var(--ab-muted); font-size: 0.82rem; line-height: 1.55; }
.ab-chip-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.ab-chip { border: 1px solid var(--ab-border); background: var(--ab-black); color: var(--ab-light); padding: 0.42rem 0.65rem; font-size: 0.75rem; }
.ab-progress { height: 8px; background: var(--ab-black); border: 1px solid var(--ab-border); overflow: hidden; margin-top: 0.45rem; }
.ab-progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--ab-gold), var(--ab-steel)); }
.ab-two-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.ab-settings-row { display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center; padding: 0.9rem 0; border-bottom: 1px solid var(--ab-border); }
.ab-settings-row:last-child { border-bottom: 0; }
@media (max-width: 968px) {
  .ad-sidebar { transform: translateX(-100%); }
  .ad-sidebar.open { transform: translateX(0); }
  .ad-content { margin-left: 0; padding: 1rem; padding-top: 5rem; }
  .ad-mobile-toggle { display: flex; align-items: center; justify-content: center; }
  .ad-overlay.show { display: block; }
  .ab-dashboard-grid, .ab-two-col { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .ab-table { font-size: 0.8rem; }
  .ab-table th, .ab-table td { padding: 0.75rem 0.5rem; }
  .ab-actions { flex-direction: column; }
}
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(styleId)?.remove(); };
  }, []);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDateTime = (d) =>
  new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

// ─── Client Detail Modal ──────────────────────────────────────────────────────
const ClientDetailModal = ({ booking, onClose }) => (
  <motion.div className="ab-modal-overlay"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div className="ab-modal"
      initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="ab-modal-close" onClick={onClose}>✕</button>
      <h3>Réservation #{booking.id}</h3>

      <div className="ab-client-panel">
        <div className="ab-client-name">{booking.client_name}</div>
        <div className="ab-client-meta">
          {booking.client_email && (
            <span>✉ <a href={`mailto:${booking.client_email}`} style={{ color: "var(--ab-gold)", textDecoration: "none" }}>{booking.client_email}</a></span>
          )}
        </div>
      </div>

      <div style={{ background: "var(--ab-black)", border: "1px solid var(--ab-border)", padding: "0.5rem 1.5rem", marginBottom: "1.5rem" }}>
        {[
          ["Service",    booking.service_name],
          ["Barbier",    booking.barber_name],
          ["Date",       fmtDate(booking.start_time)],
          ["Heure",      fmtTime(booking.start_time)],
          ["Durée",      `${booking.duration ?? "–"} min`],
          ["Prix",       `${booking.price}$ CAD`],
          ["Statut",     booking.status === "confirmed" ? "Confirmé" : booking.status === "cancelled" ? "Annulé" : "Terminé"],
          ["Réservé le", fmtDateTime(booking.created_at ?? booking.start_time)],
        ].map(([k, v]) => (
          <div key={k} className="ab-summary-row">
            <span style={{ color: "var(--ab-muted)", fontSize: "0.85rem" }}>{k}</span>
            <span style={{ color: "var(--ab-cream)", fontSize: "0.88rem", fontWeight: 500, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        {booking.client_email && (
          <a href={`mailto:${booking.client_email}`} className="ab-btn-outline" style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>
            ✉ Contacter
          </a>
        )}
        <button className="ab-btn-gold" style={{ flex: 1 }} onClick={onClose}>Fermer</button>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Helpers clients ──────────────────────────────────────────────────────────
const fmtClientDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Client Drawer ────────────────────────────────────────────────────────────
const ClientDrawer = ({ client, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loadingH, setLoadingH] = useState(true);

  useEffect(() => {
    if (!client) return;
    setLoadingH(true);
    apiClient.get("/api/booking/admin/all")
      .then(r => {
        const mine = r.data
          .filter(b => b.client_id?.toString() === client.id?.toString())
          .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        setHistory(mine);
      })
      .catch(() => {})
      .finally(() => setLoadingH(false));
  }, [client]);

  if (!client) return null;

  const fullName = [client.first_name, client.last_name].filter(Boolean).join(" ") || client.username;

  return (
    <motion.div
      className="ab-modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="ab-modal"
        style={{ maxWidth: 620 }}
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="ab-modal-close" onClick={onClose}>✕</button>

        {/* Client header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
            background: `hsl(${Math.abs(fullName.split("").reduce((h,c) => c.charCodeAt(0)+((h<<5)-h),0)) % 360}, 55%, 45%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff",
          }}>
            {fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2)}
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "var(--ab-cream)", fontWeight: 700 }}>
              {fullName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--ab-muted)", marginTop: "0.2rem" }}>
              @{client.username} · Membre depuis {fmtClientDate(client.member_since)}
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Services\ncomplétés", val: client.total_completed },
            { label: "Dépenses\ntotales",   val: `${parseFloat(client.total_spent || 0).toFixed(0)}$` },
            { label: "À venir",             val: client.upcoming },
            { label: "Annulés",             val: client.total_cancelled },
          ].map(({ label, val }) => (
            <div key={label} style={{ background: "var(--ab-black)", border: "1px solid var(--ab-border)", padding: "0.85rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--ab-cream)", fontFamily: "'Playfair Display', serif" }}>{val ?? 0}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--ab-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem", whiteSpace: "pre-line" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Infos contact */}
        <div style={{ background: "var(--ab-charcoal)", border: "1px solid var(--ab-border)", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 2rem", fontSize: "0.85rem", color: "var(--ab-light)" }}>
            {client.email && <span>✉ <a href={`mailto:${client.email}`} style={{ color: "var(--ab-gold)", textDecoration: "none" }}>{client.email}</a></span>}
            {client.phone && <span>📞 <a href={`tel:${client.phone}`} style={{ color: "var(--ab-gold)", textDecoration: "none" }}>{client.phone}</a></span>}
            {client.favourite_service && <span>✂️ Service favori : <strong style={{ color: "var(--ab-cream)" }}>{client.favourite_service}</strong></span>}
            {client.last_visit && <span>🗓 Dernière visite : <strong style={{ color: "var(--ab-cream)" }}>{fmtClientDate(client.last_visit)}</strong></span>}
            {client.first_visit && <span>🌟 Première visite : <strong style={{ color: "var(--ab-cream)" }}>{fmtClientDate(client.first_visit)}</strong></span>}
          </div>
        </div>

        {/* Historique des visites */}
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "var(--ab-cream)", marginBottom: "0.75rem" }}>
          Historique des visites
        </div>

        {loadingH ? (
          <p style={{ color: "var(--ab-muted)", fontSize: "0.85rem", padding: "1rem 0" }}>Chargement…</p>
        ) : history.length === 0 ? (
          <p style={{ color: "var(--ab-muted)", fontSize: "0.85rem" }}>Aucun historique trouvé.</p>
        ) : (
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {history.map(b => (
              <div key={b.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.65rem 0", borderBottom: "1px solid var(--ab-border)",
                gap: "1rem", flexWrap: "wrap",
              }}>
                <div>
                  <div style={{ fontSize: "0.88rem", color: "var(--ab-cream)", fontWeight: 500 }}>{b.service_name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ab-muted)", marginTop: "0.15rem" }}>
                    {fmtClientDate(b.start_time)} · {fmtTime(b.start_time)} · {b.barber_name}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ab-gold)" }}>{b.price}$</span>
                  <span className={`ab-status ${b.status}`} style={{ fontSize: "0.65rem" }}>
                    {b.status === "confirmed" ? "Confirmé" : b.status === "cancelled" ? "Annulé" : "Terminé"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          {client.email && (
            <a href={`mailto:${client.email}`} className="ab-btn-outline" style={{ flex: 1, textAlign: "center", textDecoration: "none" }}>
              ✉ Contacter
            </a>
          )}
          <button className="ab-btn-gold" style={{ flex: 1 }} onClick={onClose}>Fermer</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── ClientsTab ───────────────────────────────────────────────────────────────
const ClientsTab = () => {
  const [clients,        setClients]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    apiClient.get("/api/booking/admin/clients")
      .then(r => setClients(r.data || []))
      .catch(() => toast.error("Erreur chargement clients"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [c.username, c.first_name, c.last_name, c.email, c.phone]
      .some(f => f?.toLowerCase().includes(q));
  });

  return (
    <>
      <div className="ad-header">
        <p className="ad-eyebrow">Gestion</p>
        <h1 className="ad-display">Clients</h1>
        <span className="ab-gold-rule" />
      </div>

      {/* Notice */}
      <div className="ab-policy-notice">
        👥 Seuls les clients ayant au moins <strong style={{ color: "var(--ab-gold)" }}>un service complété</strong> apparaissent ici.
        Les inscrits sans visite terminée ne sont pas encore considérés comme clients.
      </div>

      {/* Stat rapide */}
      <div className="ab-stats" style={{ marginBottom: "1.5rem" }}>
        <div className="ab-stat-card">
          <div className="ab-stat-label">Clients actifs</div>
          <div className="ab-stat-value">{clients.length}</div>
          <div className="ab-stat-sub">≥ 1 visite terminée</div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-label">Total visites</div>
          <div className="ab-stat-value">{clients.reduce((s, c) => s + Number(c.total_completed || 0), 0)}</div>
          <div className="ab-stat-sub">services complétés</div>
        </div>
        <div className="ab-stat-card">
          <div className="ab-stat-label">Revenus totaux</div>
          <div className="ab-stat-value">{clients.reduce((s, c) => s + parseFloat(c.total_spent || 0), 0).toFixed(0)}$</div>
          <div className="ab-stat-sub">tous clients</div>
        </div>
      </div>

      {/* Recherche */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="ab-search-wrap">
          <span className="ab-search-icon">🔍</span>
          <input
            className="ab-input"
            placeholder="Rechercher par nom, email, téléphone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <p style={{ fontSize: "0.8rem", color: "var(--ab-muted)", marginBottom: "1rem" }}>
        {filtered.length} client{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <p style={{ textAlign: "center", padding: "4rem", color: "var(--ab-muted)" }}>Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="ab-empty">
          {search ? "Aucun client correspond à cette recherche." : "Aucun client avec une visite terminée pour le moment."}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="ab-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact</th>
                <th>Visites</th>
                <th>Service favori</th>
                <th>Dépenses</th>
                <th>Dernière visite</th>
                <th>Membre depuis</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username;
                const initials = fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                const avatarColor = `hsl(${Math.abs(fullName.split("").reduce((h, ch) => ch.charCodeAt(0) + ((h << 5) - h), 0)) % 360}, 55%, 42%)`;

                return (
                  <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => setSelectedClient(c)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                          background: avatarColor,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.72rem", fontWeight: 700, color: "#fff",
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--ab-cream)", fontSize: "0.9rem" }}>{fullName}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--ab-muted)" }}>@{c.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.82rem" }}>
                        {c.email && <div style={{ color: "var(--ab-light)" }}>{c.email}</div>}
                        {c.phone && <div style={{ color: "var(--ab-muted)", marginTop: "0.15rem" }}>{c.phone}</div>}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "var(--ab-gold)", fontSize: "1rem", fontFamily: "'Playfair Display', serif" }}>
                        {c.total_completed}
                      </span>
                      {Number(c.upcoming) > 0 && (
                        <span style={{ fontSize: "0.72rem", color: "var(--ab-success)", marginLeft: "0.4rem" }}>+{c.upcoming} prévu</span>
                      )}
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--ab-light)" }}>{c.favourite_service ?? "—"}</td>
                    <td style={{ fontWeight: 600, color: "var(--ab-gold)" }}>
                      {parseFloat(c.total_spent || 0).toFixed(0)}$
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--ab-light)", whiteSpace: "nowrap" }}>
                      {fmtClientDate(c.last_visit)}
                    </td>
                    <td style={{ fontSize: "0.82rem", color: "var(--ab-muted)", whiteSpace: "nowrap" }}>
                      {fmtClientDate(c.member_since)}
                    </td>
                    <td>
                      <button className="ab-icon-btn" title="Voir profil" onClick={e => { e.stopPropagation(); setSelectedClient(c); }}>
                        👁
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selectedClient && (
          <ClientDrawer client={selectedClient} onClose={() => setSelectedClient(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  useAdminStyles();
  const navigate = useNavigate();

  const [activeTab,      setActiveTab]      = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookings,       setBookings]       = useState([]);
  const [services,       setServices]       = useState([]);
  const [barbers,        setBarbers]        = useState([]);
  const [galleryPhotos,  setGalleryPhotos]  = useState([]);
  const [reviews,        setReviews]        = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [search,         setSearch]         = useState("");
  const [filterDate,     setFilterDate]     = useState(new Date().toISOString().split("T")[0]);
  const [filterBarber,   setFilterBarber]   = useState("");
  const [filterStatus,   setFilterStatus]   = useState("");
  const [stats,          setStats]          = useState({ today: 0, week: 0, month: 0, revenue: 0, cancelled: 0 });
  const [detailTarget,   setDetailTarget]   = useState(null);
  const [photoForm,      setPhotoForm]      = useState({
    title: "",
    description: "",
    category: "coupe",
    imageData: "",
    isFeatured: false,
    showInGallery: true,
    showOnHome: true,
    showOnServices: false,
  });
  const [photoSaving,    setPhotoSaving]    = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes, barbersRes, galleryRes, reviewsRes] = await Promise.all([
        apiClient.get("/api/booking/admin/all"),
        apiClient.get("/api/booking/services"),
        apiClient.get("/api/booking/barbers"),
        apiClient.get("/api/gallery?includeHidden=true"),
        apiClient.get("/api/reviews?includeHidden=true"),
      ]);
      setBookings(bookingsRes.data);
      setServices(servicesRes.data);
      setBarbers(barbersRes.data);
      setGalleryPhotos(galleryRes.data || []);
      setReviews(reviewsRes.data || []);
      calcStats(bookingsRes.data);
    } catch (err) {
      setError("Erreur de chargement");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (!token || role !== "admin") { navigate("/login"); return; }
    fetchInitialData();
  }, [navigate, fetchInitialData]);

  const calcStats = (data) => {
    const today    = new Date().toISOString().split("T")[0];
    const weekAgo  = new Date(Date.now() - 7  * 86400000).toISOString();
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    setStats({
      today:     data.filter(b => b.start_time.startsWith(today) && b.status === "confirmed").length,
      week:      data.filter(b => b.start_time >= weekAgo  && b.status === "confirmed").length,
      month:     data.filter(b => b.start_time >= monthAgo && b.status === "confirmed").length,
      cancelled: data.filter(b => b.start_time >= monthAgo && b.status === "cancelled").length,
      revenue:   data.filter(b => b.start_time >= monthAgo && b.status === "completed")
                    .reduce((s, b) => s + parseFloat(b.price || 0), 0),
    });
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    if (!window.confirm("Annuler cette réservation ? Un email sera envoyé au client.")) return;
    try {
      await apiClient.patch(`/api/booking/admin/${id}/cancel`);
      toast.success("Réservation annulée — client notifié par email");
      fetchInitialData();
    } catch { toast.error("Erreur lors de l'annulation"); }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Marquer ce rendez-vous comme terminé ?")) return;
    try {
      await apiClient.patch(`/api/booking/admin/${id}/complete`);
      toast.success("Rendez-vous marqué comme terminé");
      fetchInitialData();
    } catch { toast.error("Erreur"); }
  };

  // ── Filtered bookings ──────────────────────────────────────────────────────
  const filtered = bookings.filter(b => {
    const matchDate   = !filterDate   || b.start_time.startsWith(filterDate);
    const matchBarber = !filterBarber || b.barber_id?.toString() === filterBarber;
    const matchStatus = !filterStatus || b.status === filterStatus;
    const matchSearch = !search || [b.client_name, b.service_name, b.barber_name, String(b.id)]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    return matchDate && matchBarber && matchStatus && matchSearch;
  });

  const todayKey = new Date().toISOString().split("T")[0];
  const nowTime = Date.now();
  const todayBookings = useMemo(
    () => bookings
      .filter(b => b.start_time?.startsWith(todayKey))
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)),
    [bookings, todayKey]
  );
  const upcomingBookings = useMemo(
    () => bookings
      .filter(b => b.status === "confirmed" && new Date(b.start_time).getTime() >= nowTime)
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .slice(0, 6),
    [bookings, nowTime]
  );
  const completedRevenueToday = todayBookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + parseFloat(b.price || 0), 0);
  const confirmedToday = todayBookings.filter(b => b.status === "confirmed").length;
  const completedToday = todayBookings.filter(b => b.status === "completed").length;
  const cancelledToday = todayBookings.filter(b => b.status === "cancelled").length;

  const serviceDemand = useMemo(() => {
    const demand = bookings.reduce((acc, booking) => {
      const name = booking.service_name || "Service";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(demand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [bookings]);

  const barberPerformance = useMemo(() => {
    return barbers.map(barber => {
      const barberBookings = bookings.filter(b => b.barber_id?.toString() === barber.id?.toString());
      const completed = barberBookings.filter(b => b.status === "completed");
      const revenue = completed.reduce((sum, b) => sum + parseFloat(b.price || 0), 0);
      return {
        ...barber,
        totalBookings: barberBookings.length,
        confirmed: barberBookings.filter(b => b.status === "confirmed").length,
        completed: completed.length,
        revenue,
      };
    });
  }, [barbers, bookings]);

  const maxServiceDemand = Math.max(1, ...serviceDemand.map(([, count]) => count));
  const formatMoney = (value) => `${Number(value || 0).toFixed(0)}$ CAD`;

  const renderOperationSnapshot = () => (
    <div className="ab-dashboard-grid" style={{ marginBottom: "2rem" }}>
      <div className="ab-panel">
        <div className="ab-panel-title">Operations du jour</div>
        <div className="ab-kpi-grid">
          <div className="ab-kpi"><strong>{todayBookings.length}</strong><span>rendez-vous</span></div>
          <div className="ab-kpi"><strong>{confirmedToday}</strong><span>a venir</span></div>
          <div className="ab-kpi"><strong>{completedToday}</strong><span>termines</span></div>
          <div className="ab-kpi"><strong>{formatMoney(completedRevenueToday)}</strong><span>revenu encaisse</span></div>
        </div>
        <div className="ab-chip-row">
          <span className="ab-chip">{cancelledToday} annule aujourd'hui</span>
          <span className="ab-chip">{stats.cancelled} annulations sur 30 jours</span>
          <span className="ab-chip">{bookings.length} reservations total</span>
        </div>
      </div>
      <div className="ab-panel">
        <div className="ab-panel-title">Prochains rendez-vous</div>
        <div className="ab-list">
          {upcomingBookings.length === 0 ? (
            <div className="ab-list-meta">Aucun rendez-vous confirme a venir.</div>
          ) : upcomingBookings.slice(0, 4).map(booking => (
            <div className="ab-list-item" key={booking.id}>
              <div className="ab-list-main">
                <span>{booking.client_name}</span>
                <span>{fmtTime(booking.start_time)}</span>
              </div>
              <div className="ab-list-meta">
                {fmtDate(booking.start_time)} · {booking.service_name} · {booking.barber_name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const readImageFile = (file) => new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return reject(new Error("Format accepte: JPG, PNG ou WebP."));
    }
    if (file.size > 6 * 1024 * 1024) {
      return reject(new Error("Image trop lourde. Maximum 6 MB."));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });

  const handlePhotoFile = async (event) => {
    try {
      const imageData = await readImageFile(event.target.files?.[0]);
      setPhotoForm(prev => ({ ...prev, imageData }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreatePhoto = async (event) => {
    event.preventDefault();
    if (!photoForm.title.trim() || !photoForm.imageData) {
      toast.error("Ajoutez un titre et une image.");
      return;
    }
    setPhotoSaving(true);
    try {
      const res = await apiClient.post("/api/gallery", {
        title: photoForm.title,
        description: photoForm.description,
        category: photoForm.category,
        imageData: photoForm.imageData,
        isFeatured: photoForm.isFeatured,
        isPublished: true,
        showInGallery: photoForm.showInGallery,
        showOnHome: photoForm.showOnHome || photoForm.isFeatured,
        showOnServices: photoForm.showOnServices,
      });
      setGalleryPhotos(prev => [res.data, ...prev.map(p => photoForm.isFeatured ? { ...p, is_featured: false } : p)]);
      setPhotoForm({
        title: "",
        description: "",
        category: "coupe",
        imageData: "",
        isFeatured: false,
        showInGallery: true,
        showOnHome: true,
        showOnServices: false,
      });
      toast.success("Photo publiee aux emplacements choisis");
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload impossible");
    } finally {
      setPhotoSaving(false);
    }
  };

  const updateGalleryPhoto = async (id, payload) => {
    try {
      const res = await apiClient.patch(`/api/gallery/${id}`, payload);
      setGalleryPhotos(prev => prev.map(photo => {
        if (payload.isFeatured === true && photo.id !== id) return { ...photo, is_featured: false };
        return photo.id === id ? res.data : photo;
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Modification impossible");
    }
  };

  const deleteGalleryPhoto = async (id) => {
    if (!window.confirm("Supprimer cette photo de la galerie ?")) return;
    try {
      await apiClient.delete(`/api/gallery/${id}`);
      setGalleryPhotos(prev => prev.filter(photo => photo.id !== id));
      toast.success("Photo supprimee");
    } catch {
      toast.error("Suppression impossible");
    }
  };

  const updateReview = async (id, isApproved) => {
    try {
      const res = await apiClient.patch(`/api/reviews/${id}`, { isApproved });
      setReviews(prev => prev.map(review => review.id === id ? { ...review, is_approved: res.data.is_approved } : review));
    } catch {
      toast.error("Modification de l'avis impossible");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Supprimer definitivement cet avis ?")) return;
    try {
      await apiClient.delete(`/api/reviews/${id}`);
      setReviews(prev => prev.filter(review => review.id !== id));
      toast.success("Avis supprime");
    } catch {
      toast.error("Suppression de l'avis impossible");
    }
  };

  const menuItems = [
    { id: "overview",  label: "Vue SaaS",     icon: "⌘" },
    { id: "bookings",  label: "Réservations", icon: "📅" },
    { id: "clients",   label: "Clients",      icon: "👥" },
    { id: "barbers",   label: "Barbiers",     icon: "✂️" },
    { id: "services",  label: "Services",     icon: "💈" },
    { id: "gallery",   label: "Galerie",      icon: "🖼️" },
    { id: "reviews",   label: "Avis",         icon: "⭐" },
    { id: "stats",     label: "Statistiques", icon: "📊" },
    { id: "chat",      label: "Chat Live",    icon: "💬" },
    { id: "settings",  label: "Paramètres",   icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {

      case "overview": return (
        <>
          <div className="ad-header">
            <p className="ad-eyebrow">Pilotage 2026</p>
            <h1 className="ad-display">Centre d'operations</h1>
            <span className="ab-gold-rule" />
          </div>
          {renderOperationSnapshot()}
          <div className="ab-two-col">
            <div className="ab-panel">
              <div className="ab-panel-title">Actions prioritaires</div>
              <div className="ab-list">
                <div className="ab-list-item">
                  <div className="ab-list-main"><span>Photos publiees</span><span>{galleryPhotos.filter(p => p.is_published).length}</span></div>
                  <div className="ab-list-meta">La page d'accueil et la galerie publique se nourrissent de ces photos.</div>
                </div>
                <div className="ab-list-item">
                  <div className="ab-list-main"><span>Avis visibles</span><span>{reviews.filter(r => r.is_approved).length}</span></div>
                  <div className="ab-list-meta">Les avis clients renforcent la confiance avant reservation.</div>
                </div>
                <div className="ab-list-item">
                  <div className="ab-list-main"><span>Services actifs</span><span>{services.length}</span></div>
                  <div className="ab-list-meta">Gardez les prix, durees et descriptions clairs pour eviter les frictions.</div>
                </div>
              </div>
            </div>
            <div className="ab-panel">
              <div className="ab-panel-title">Qualite operationnelle</div>
              <div className="ab-list">
                <div className="ab-list-item"><div className="ab-list-main"><span>Reservations total</span><span>{bookings.length}</span></div></div>
                <div className="ab-list-item"><div className="ab-list-main"><span>Revenu complete 30 jours</span><span>{formatMoney(stats.revenue)}</span></div></div>
                <div className="ab-list-item"><div className="ab-list-main"><span>Annulations 30 jours</span><span>{stats.cancelled}</span></div></div>
              </div>
            </div>
          </div>
        </>
      );

      case "bookings": return (
        <>
          <div className="ad-header">
            <p className="ad-eyebrow">Administration</p>
            <h1 className="ad-display">Gestion des Réservations</h1>
            <span className="ab-gold-rule" />
          </div>

          {/* Policy notice */}
          <div className="ab-policy-notice">
            📋 <strong style={{ color: "var(--ab-gold)" }}>Politique de modification :</strong>{" "}
            Seul le client peut reporter son rendez-vous, via son espace personnel <em>/compte</em>.
            L'admin peut uniquement <strong>terminer</strong> ou <strong>annuler</strong> un rendez-vous — le client est notifié par email automatiquement.
          </div>

          {renderOperationSnapshot()}

          {/* Stats */}
          <div className="ab-stats">
            {[
              { label: "Aujourd'hui",   val: stats.today,                   sub: "confirmés" },
              { label: "Cette semaine", val: stats.week,                    sub: "confirmés" },
              { label: "Ce mois",       val: stats.month,                   sub: "confirmés" },
              { label: "Annulés/mois",  val: stats.cancelled,               sub: "ce mois" },
              { label: "Revenus/mois",  val: `${stats.revenue.toFixed(0)}$`, sub: "terminés" },
            ].map(({ label, val, sub }) => (
              <div key={label} className="ab-stat-card">
                <div className="ab-stat-label">{label}</div>
                <div className="ab-stat-value">{val}</div>
                <div className="ab-stat-sub">{sub}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="ab-filters">
            <div>
              <label className="ab-label">Recherche</label>
              <div className="ab-search-wrap">
                <span className="ab-search-icon">🔍</span>
                <input className="ab-input" placeholder="Client, service, barbier, #ID…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="ab-label">Date</label>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="ab-input" />
            </div>
            <div>
              <label className="ab-label">Statut</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="ab-select">
                <option value="">Tous</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
            <div>
              <label className="ab-label">Barbier</label>
              <select value={filterBarber} onChange={e => setFilterBarber(e.target.value)} className="ab-select">
                <option value="">Tous</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name || barber.full_name || `Barbier #${barber.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button onClick={() => { setFilterDate(""); setFilterBarber(""); setFilterStatus(""); setSearch(""); }} className="ab-btn-outline" style={{ width: "100%" }}>
                Réinitialiser
              </button>
            </div>
          </div>

          {error && <div className="ab-error">{error}</div>}

          <p style={{ fontSize: "0.8rem", color: "var(--ab-muted)", marginBottom: "1rem" }}>
            {filtered.length} réservation{filtered.length !== 1 ? "s" : ""} affichée{filtered.length !== 1 ? "s" : ""}
          </p>

          {loading ? (
            <p style={{ textAlign: "center", padding: "4rem", color: "var(--ab-muted)" }}>Chargement…</p>
          ) : filtered.length === 0 ? (
            <div className="ab-empty">Aucune réservation trouvée</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="ab-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date & Heure</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Barbier</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: "var(--ab-muted)", fontSize: "0.8rem" }}>#{b.id}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{fmtDateTime(b.start_time)}</td>
                      <td>
                        <div style={{ fontWeight: 500, color: "var(--ab-cream)" }}>{b.client_name}</div>
                        {b.client_email && <div style={{ fontSize: "0.75rem", color: "var(--ab-muted)" }}>{b.client_email}</div>}
                      </td>
                      <td>{b.service_name}</td>
                      <td>{b.barber_name}</td>
                      <td style={{ fontWeight: 600, color: "var(--ab-gold)" }}>{b.price}$</td>
                      <td>
                        <span className={`ab-status ${b.status}`}>
                          {b.status === "confirmed" ? "Confirmé" : b.status === "cancelled" ? "Annulé" : "Terminé"}
                        </span>
                      </td>
                      <td>
                        <div className="ab-actions">
                          {/* Voir détails */}
                          <button onClick={() => setDetailTarget(b)} className="ab-icon-btn" title="Voir détails">👁</button>

                          {b.status === "confirmed" && (
                            <>
                              {/* Marquer terminé */}
                              <button onClick={() => handleComplete(b.id)} className="ab-icon-btn success" title="Marquer comme terminé">✓</button>
                              {/* Annuler + notifier client */}
                              <button onClick={() => handleCancel(b.id)} className="ab-icon-btn danger" title="Annuler (notifie le client)">✕</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      );

      case "chat": return (
        <>
          <div className="ad-header">
            <p className="ad-eyebrow">Communication</p>
            <h1 className="ad-display">Chat Live</h1>
            <span className="ab-gold-rule" />
          </div>
          <ChatApp isAdmin={true} />
        </>
      );

      case "clients":
        return <ClientsTab />;

      case "barbers":
        return (
          <>
            <div className="ad-header"><p className="ad-eyebrow">Equipe</p><h1 className="ad-display">Barbiers</h1><span className="ab-gold-rule" /></div>
            <div className="ab-dashboard-grid">
              <div className="ab-panel">
                <div className="ab-panel-title">Performance de l'equipe</div>
                <div className="ab-list">
                  {barberPerformance.length === 0 ? (
                    <div className="ab-list-meta">Aucun barbier charge depuis l'API.</div>
                  ) : barberPerformance.map(barber => (
                    <div className="ab-list-item" key={barber.id}>
                      <div className="ab-list-main">
                        <span>{barber.name || barber.full_name || `Barbier #${barber.id}`}</span>
                        <span>{formatMoney(barber.revenue)}</span>
                      </div>
                      <div className="ab-list-meta">
                        {barber.totalBookings} reservation(s) - {barber.confirmed} a venir - {barber.completed} terminee(s)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ab-panel">
                <div className="ab-panel-title">Organisation</div>
                <div className="ab-chip-row">
                  <span className="ab-chip">{barbers.length} barbier(s) actif(s)</span>
                  <span className="ab-chip">{confirmedToday} rendez-vous aujourd'hui</span>
                  <span className="ab-chip">{upcomingBookings.length} prochains confirmes</span>
                </div>
                <p className="ab-list-meta" style={{ marginTop: "1rem" }}>
                  Utilisez le filtre barbier dans l'onglet reservations pour isoler rapidement l'agenda d'un membre de l'equipe.
                </p>
              </div>
            </div>
          </>
        );

      case "services":
        return (
          <>
            <div className="ad-header"><p className="ad-eyebrow">Catalogue</p><h1 className="ad-display">Services</h1><span className="ab-gold-rule" /></div>
            <div className="ab-dashboard-grid">
              <div className="ab-panel">
                <div className="ab-panel-title">Catalogue charge</div>
                <div className="ab-list">
                  {services.length === 0 ? (
                    <div className="ab-list-meta">Aucun service charge depuis l'API.</div>
                  ) : services.map(service => (
                    <div className="ab-list-item" key={service.id || service.name}>
                      <div className="ab-list-main">
                        <span>{service.name || service.title || `Service #${service.id}`}</span>
                        <span>{service.price ? formatMoney(service.price) : "Prix a verifier"}</span>
                      </div>
                      <div className="ab-list-meta">
                        {service.duration ? `${service.duration} min` : "Duree non renseignee"}
                        {service.description ? ` - ${service.description}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ab-panel">
                <div className="ab-panel-title">Demande par service</div>
                <div className="ab-list">
                  {serviceDemand.length === 0 ? (
                    <div className="ab-list-meta">Les demandes apparaitront apres les premieres reservations.</div>
                  ) : serviceDemand.map(([name, count]) => (
                    <div className="ab-list-item" key={name}>
                      <div className="ab-list-main"><span>{name}</span><span>{count}</span></div>
                      <div className="ab-progress"><span style={{ width: `${Math.max(8, (count / maxServiceDemand) * 100)}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case "gallery":
        return (
          <>
            <div className="ad-header"><p className="ad-eyebrow">Media</p><h1 className="ad-display">Galerie dynamique</h1><span className="ab-gold-rule" /></div>
            <div className="ab-dashboard-grid">
              <form className="ab-panel" onSubmit={handleCreatePhoto}>
                <div className="ab-panel-title">Publier une photo</div>
                <div style={{ display: "grid", gap: "0.9rem" }}>
                  <div>
                    <label className="ab-label">Nom affiche de la coupe / photo</label>
                    <input className="ab-input" value={photoForm.title} onChange={e => setPhotoForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Ex: Fade bas propre, barbe sculptee, waves 360" />
                  </div>
                  <div>
                    <label className="ab-label">Categorie de style</label>
                    <select className="ab-select" value={photoForm.category} onChange={e => setPhotoForm(prev => ({ ...prev, category: e.target.value }))}>
                      <option value="coupe">Coupe</option>
                      <option value="barbe">Barbe</option>
                      <option value="salon">Salon</option>
                      <option value="avant-apres">Avant / Apres</option>
                      <option value="texture">Texture</option>
                    </select>
                  </div>
                  <div>
                    <label className="ab-label">Description marketing</label>
                    <textarea className="ab-input" rows="3" value={photoForm.description} onChange={e => setPhotoForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Ex: Finition nette, contours propres et barbe travaillee pour un rendu premium." />
                  </div>
                  <div>
                    <label className="ab-label">Image JPG, PNG ou WebP - max 6 MB</label>
                    <input className="ab-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoFile} />
                  </div>
                  {photoForm.imageData && (
                    <img src={photoForm.imageData} alt="Apercu upload" style={{ width: "100%", maxHeight: 260, objectFit: "cover", border: "1px solid var(--ab-border)" }} />
                  )}
                  <label style={{ display: "flex", gap: "0.6rem", alignItems: "center", color: "var(--ab-light)", fontSize: "0.85rem" }}>
                    <input type="checkbox" checked={photoForm.isFeatured} onChange={e => setPhotoForm(prev => ({ ...prev, isFeatured: e.target.checked }))} />
                    Utiliser comme photo principale de la page d'accueil
                  </label>
                  <div style={{ display: "grid", gap: "0.6rem", border: "1px solid var(--ab-border)", padding: "0.9rem" }}>
                    <div className="ab-label">Emplacements de publication</div>
                    <label style={{ display: "flex", gap: "0.6rem", alignItems: "center", color: "var(--ab-light)", fontSize: "0.85rem" }}>
                      <input type="checkbox" checked={photoForm.showInGallery} onChange={e => setPhotoForm(prev => ({ ...prev, showInGallery: e.target.checked }))} />
                      Page galerie publique avec le nom de la coupe
                    </label>
                    <label style={{ display: "flex", gap: "0.6rem", alignItems: "center", color: "var(--ab-light)", fontSize: "0.85rem" }}>
                      <input type="checkbox" checked={photoForm.showOnHome || photoForm.isFeatured} disabled={photoForm.isFeatured} onChange={e => setPhotoForm(prev => ({ ...prev, showOnHome: e.target.checked }))} />
                      Page d'accueil / lookbook avec le nom de la coupe
                    </label>
                    <label style={{ display: "flex", gap: "0.6rem", alignItems: "center", color: "var(--ab-light)", fontSize: "0.85rem" }}>
                      <input type="checkbox" checked={photoForm.showOnServices} onChange={e => setPhotoForm(prev => ({ ...prev, showOnServices: e.target.checked }))} />
                      Page services avec le nom de la coupe
                    </label>
                  </div>
                  <button className="ab-btn-gold" type="submit" disabled={photoSaving}>
                    {photoSaving ? "Publication..." : "Publier la photo"}
                  </button>
                </div>
              </form>

              <div className="ab-panel">
                <div className="ab-panel-title">Photos publiees</div>
                <div className="ab-list">
                  {galleryPhotos.length === 0 ? (
                    <div className="ab-list-meta">Aucune photo encore. Ajoutez les vraies coupes du salon; le nom saisi ici sera affiche sur l'accueil, la galerie et les services selon les emplacements choisis.</div>
                  ) : galleryPhotos.map(photo => (
                    <div className="ab-list-item" key={photo.id}>
                      <img src={photo.image_data} alt={photo.title} style={{ width: "100%", height: 180, objectFit: "cover", border: "1px solid var(--ab-border)" }} />
                      <div className="ab-list-main"><span>{photo.title}</span><span>{photo.category}</span></div>
                      <div className="ab-chip-row">
                        {photo.is_featured && <span className="ab-chip">Accueil</span>}
                        <span className="ab-chip">{photo.is_published ? "Publiee" : "Masquee"}</span>
                        {photo.show_in_gallery && <span className="ab-chip">Galerie</span>}
                        {photo.show_on_home && <span className="ab-chip">Accueil/Lookbook</span>}
                        {photo.show_on_services && <span className="ab-chip">Services</span>}
                      </div>
                      <div className="ab-actions">
                        <button className="ab-icon-btn" onClick={() => updateGalleryPhoto(photo.id, { isFeatured: true, showOnHome: true, isPublished: true })}>Hero accueil</button>
                        <button className="ab-icon-btn" onClick={() => updateGalleryPhoto(photo.id, { showInGallery: !photo.show_in_gallery })}>
                          {photo.show_in_gallery ? "Retirer galerie" : "Mettre galerie"}
                        </button>
                        <button className="ab-icon-btn" onClick={() => updateGalleryPhoto(photo.id, { showOnHome: !photo.show_on_home })}>
                          {photo.show_on_home ? "Retirer accueil" : "Mettre accueil"}
                        </button>
                        <button className="ab-icon-btn" onClick={() => updateGalleryPhoto(photo.id, { showOnServices: !photo.show_on_services })}>
                          {photo.show_on_services ? "Retirer services" : "Mettre services"}
                        </button>
                        <button className="ab-icon-btn" onClick={() => updateGalleryPhoto(photo.id, { isPublished: !photo.is_published })}>
                          {photo.is_published ? "Masquer" : "Publier"}
                        </button>
                        <button className="ab-icon-btn danger" onClick={() => deleteGalleryPhoto(photo.id)}>Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case "reviews":
        return (
          <>
            <div className="ad-header"><p className="ad-eyebrow">Reputation</p><h1 className="ad-display">Avis clients</h1><span className="ab-gold-rule" /></div>
            <div className="ab-panel">
              <div className="ab-panel-title">Avis recus apres coupe terminee</div>
              <div className="ab-list">
                {reviews.length === 0 ? (
                  <div className="ab-list-meta">Aucun avis client pour le moment.</div>
                ) : reviews.map(review => (
                  <div className="ab-list-item" key={review.id}>
                    <div className="ab-list-main">
                      <span>{review.client_name || "Client"}</span>
                      <span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    </div>
                    <div className="ab-list-meta">
                      {review.service_name || "Service"} avec {review.barber_name || "barbier"} - reservation #{review.booking_id}
                    </div>
                    {review.title && <strong style={{ color: "var(--ab-cream)" }}>{review.title}</strong>}
                    <p style={{ color: "var(--ab-light)", lineHeight: 1.65, margin: 0 }}>{review.comment}</p>
                    <div className="ab-actions">
                      <button className="ab-icon-btn" onClick={() => updateReview(review.id, !review.is_approved)}>
                        {review.is_approved ? "Masquer" : "Approuver"}
                      </button>
                      <button className="ab-icon-btn danger" onClick={() => deleteReview(review.id)}>Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "stats":
        return (
          <>
            <div className="ad-header"><p className="ad-eyebrow">Analytics</p><h1 className="ad-display">Statistiques</h1><span className="ab-gold-rule" /></div>
            <div className="ab-kpi-grid">
              <div className="ab-kpi"><strong>{stats.today}</strong><span>confirmes aujourd'hui</span></div>
              <div className="ab-kpi"><strong>{stats.week}</strong><span>confirmes 7 jours</span></div>
              <div className="ab-kpi"><strong>{stats.month}</strong><span>confirmes 30 jours</span></div>
              <div className="ab-kpi"><strong>{formatMoney(stats.revenue)}</strong><span>revenu termine</span></div>
            </div>
            <div className="ab-two-col">
              <div className="ab-panel">
                <div className="ab-panel-title">Services les plus demandes</div>
                <div className="ab-list">
                  {serviceDemand.length === 0 ? (
                    <div className="ab-list-meta">Aucune reservation analysee pour le moment.</div>
                  ) : serviceDemand.map(([name, count]) => (
                    <div className="ab-list-item" key={name}>
                      <div className="ab-list-main"><span>{name}</span><span>{count}</span></div>
                      <div className="ab-progress"><span style={{ width: `${Math.max(8, (count / maxServiceDemand) * 100)}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ab-panel">
                <div className="ab-panel-title">Sante operationnelle</div>
                <div className="ab-list">
                  <div className="ab-list-item"><div className="ab-list-main"><span>Taux d'annulation 30 jours</span><span>{stats.month + stats.cancelled ? Math.round((stats.cancelled / (stats.month + stats.cancelled)) * 100) : 0}%</span></div></div>
                  <div className="ab-list-item"><div className="ab-list-main"><span>Reservations en base</span><span>{bookings.length}</span></div></div>
                  <div className="ab-list-item"><div className="ab-list-main"><span>Clients planifies aujourd'hui</span><span>{todayBookings.length}</span></div></div>
                </div>
              </div>
            </div>
          </>
        );

      case "settings":
        return (
          <>
            <div className="ad-header"><p className="ad-eyebrow">Configuration</p><h1 className="ad-display">Parametres</h1><span className="ab-gold-rule" /></div>
            <div className="ab-dashboard-grid">
              <div className="ab-panel">
                <div className="ab-panel-title">Profil du salon</div>
                {[
                  ["Nom", "Mr. Renaudin Barbershop"],
                  ["Pays", "Canada"],
                  ["Telephone", "514-778-8318"],
                  ["Adresse", "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7"],
                  ["Devise", "CAD"],
                ].map(([label, value]) => (
                  <div className="ab-settings-row" key={label}>
                    <span className="ab-list-meta">{label}</span>
                    <strong style={{ color: "var(--ab-cream)", textAlign: "right" }}>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="ab-panel">
                <div className="ab-panel-title">Systeme</div>
                <div className="ab-chip-row">
                  <span className="ab-chip">Frontend Vercel</span>
                  <span className="ab-chip">Backend Render</span>
                  <span className="ab-chip">Database Supabase</span>
                  <span className="ab-chip">Chat live actif</span>
                  <span className="ab-chip">Emails client</span>
                </div>
                <p className="ab-list-meta" style={{ marginTop: "1rem" }}>
                  Ces parametres documentent l'exploitation actuelle. Les modifications deployables passent par GitHub puis les plateformes connectees.
                </p>
              </div>
            </div>
          </>
        );

      /*

      case "barbers":
        return (<><div className="ad-header"><p className="ad-eyebrow">Équipe</p><h1 className="ad-display">Barbiers</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Barbiers en développement…</p></>);
      case "services":
        return (<><div className="ad-header"><p className="ad-eyebrow">Catalogue</p><h1 className="ad-display">Services</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Services en développement…</p></>);
      case "stats":
        return (<><div className="ad-header"><p className="ad-eyebrow">Analytics</p><h1 className="ad-display">Statistiques</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Statistiques en développement…</p></>);
      case "settings":
        return (<><div className="ad-header"><p className="ad-eyebrow">Configuration</p><h1 className="ad-display">Paramètres</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Paramètres en développement…</p></>);
      */
      default: return null;
    }
  };

  return (
    <div className="ad-root">
      <button className="ad-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
      <div className={`ad-overlay ${mobileMenuOpen ? "show" : ""}`} onClick={() => setMobileMenuOpen(false)} />

      <aside className={`ad-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="ad-logo">
          <div className="ad-logo-title">Mr. Renaudin</div>
          <div className="ad-logo-sub">Admin Panel</div>
        </div>
        <nav className="ad-nav">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`ad-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="ad-content">{renderContent()}</main>

      <AnimatePresence>
        {detailTarget && (
          <ClientDetailModal
            booking={detailTarget}
            onClose={() => setDetailTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
