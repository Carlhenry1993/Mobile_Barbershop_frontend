import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ChatApp from "../components/ChatApp";

axios.defaults.baseURL = "https://mobile-barbershop-backend.onrender.com";

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

/* HAMBURGER FIX : descendu sous le header */
.ad-mobile-toggle {
  display: none;
  position: fixed;
  top: 5.5rem;
  left: 1rem;
  z-index: 90;
  background: var(--ab-gold);
  color: var(--ab-black);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.ad-header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--ab-border); }
.ad-eyebrow { font-size: 0.68rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--ab-gold); margin-bottom: 0.5rem; }
.ad-display { font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--ab-cream); line-height: 1.1; }
.ab-gold-rule { display: block; width: 60px; height: 2px; background: var(--ab-gold); margin: 1rem 0 0; }
.ab-btn-gold,.ab-btn-outline,.ab-btn-danger {
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
.ab-input,.ab-select,.ab-textarea {
  width: 100%; background: var(--ab-black); border: 1px solid var(--ab-border);
  color: var(--ab-cream); font-size: 0.9rem; padding: 0.75rem 1rem;
  transition: border-color 0.3s; font-family: 'DM Sans', sans-serif;
}
.ab-textarea { resize: vertical; min-height: 80px; }
.ab-input:focus,.ab-select:focus,.ab-textarea:focus { outline: none; border-color: var(--ab-gold); }
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
  padding: 2rem; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;
}
.ab-modal h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--ab-cream); margin-bottom: 1.5rem; }
.ab-modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; color: var(--ab-muted);
  font-size: 1.3rem; cursor: pointer; transition: color 0.2s;
}
.ab-modal-close:hover { color: var(--ab-cream); }
.ab-form-group { margin-bottom: 1.25rem; }
.ab-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.ab-stat-card { background: var(--ab-card); border: 1px solid var(--ab-border); padding: 1.5rem; transition: border-color 0.25s; }
.ab-stat-card:hover { border-color: rgba(212,168,67,0.3); }
.ab-stat-label { color: var(--ab-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
.ab-stat-value { color: var(--ab-cream); font-size: 2rem; font-weight: 700; font-family: 'Playfair Display', serif; }
.ab-stat-sub { font-size: 0.75rem; color: var(--ab-muted); margin-top: 0.25rem; }
.ab-empty { text-align: center; padding: 4rem 2rem; color: var(--ab-muted); }
.ab-error { background: rgba(231,76,60,0.1); border: 1px solid rgba(231,76,60,0.3); color: #ff8a7a; padding: 1rem; font-size: 0.85rem; margin-bottom: 1.5rem; }
.ad-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; }
.ab-client-panel {
  background: var(--ab-charcoal); border: 1px solid var(--ab-border);
  padding: 1.5rem; margin-bottom: 1.5rem;
}
.ab-client-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--ab-cream); margin-bottom: 0.5rem; }
.ab-client-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-size: 0.85rem; color: var(--ab-light); }
.ab-client-meta span { display: flex; align-items: center; gap: 0.4rem; }
.ab-summary-row { display: flex; justify-content: space-between; padding: 0.55rem 0; border-bottom: 1px solid var(--ab-border); font-size: 0.88rem; }
.ab-summary-row:last-child { border-bottom: none; }
.ab-slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(85px, 1fr)); gap: 0.5rem; margin-top: 0.6rem; }
.ab-slot {
  padding: 0.6rem; text-align: center; background: var(--ab-black);
  border: 1px solid var(--ab-border); color: var(--ab-light);
  font-size: 0.82rem; cursor: pointer; transition: all 0.18s;
}
.ab-slot:hover { border-color: var(--ab-gold); color: var(--ab-cream); }
.ab-slot.selected { background: var(--ab-gold); color: var(--ab-black); border-color: var(--ab-gold); font-weight: 700; }
.ab-search-wrap { position: relative; }
.ab-search-wrap input { padding-left: 2.2rem; }
.ab-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--ab-muted); font-size: 0.9rem; pointer-events: none; }

.ab-booking-card {
  display: none;
  background: var(--ab-card);
  border: 1px solid var(--ab-border);
  padding: 1rem;
  margin-bottom: 1rem;
}
.ab-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--ab-border);
  font-size: 0.85rem;
}
.ab-card-row:last-child { border-bottom: none; }
.ab-card-label { color: var(--ab-muted); font-size: 0.75rem; text-transform: uppercase; }
.ab-card-value { color: var(--ab-cream); font-weight: 500; text-align: right; }
.ab-card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--ab-border);
}
.ab-card-actions.ab-icon-btn { flex: 1; }

.ab-filters-toggle {
  display: none;
  width: 100%;
  background: var(--ab-card);
  border: 1px solid var(--ab-border);
  color: var(--ab-gold);
  padding: 0.85rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  margin-bottom: 1rem;
}

@media (max-width: 968px) {
.ad-sidebar { transform: translateX(-100%); }
.ad-sidebar.open { transform: translateX(0); }
.ad-content { margin-left: 0; padding: 1rem; padding-top: 6rem; }
.ad-mobile-toggle { display: flex; align-items: center; justify-content: center; }
.ad-overlay.show { display: block; }
.ab-stats { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
.ab-table { display: none; }
.ab-booking-card { display: block; }
.ab-filters {
    display: none;
    grid-template-columns: 1fr;
  }
.ab-filters.show { display: grid; }
.ab-filters-toggle { display: block; }
.ab-stats { grid-template-columns: 1fr; }
.ab-modal {
    padding: 1.5rem 1rem;
    max-height: 100vh;
    height: 100%;
    border-radius: 0;
  }
.ab-btn-gold,.ab-btn-outline,.ab-btn-danger {
    padding: 1rem;
    font-size: 0.85rem;
  }
.ab-slots { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 400px) {
.ad-content { padding: 0.75rem; padding-top: 5.5rem; }
.ad-display { font-size: 1.5rem; }
.ab-slots { grid-template-columns: repeat(2, 1fr); }
.ad-mobile-toggle { width: 44px; height: 44px; }
}
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(styleId)?.remove(); };
  }, []);
};

const fmtDateTime = (d) =>
  new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const getMinDate = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; };

const AdminRescheduleModal = ({ booking, services, barbers, onClose, onSuccess }) => {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [barberId, setBarberId] = useState(booking.barber_id?.toString()?? "");
  const [serviceId,setServiceId]= useState(booking.service_id?.toString()?? "");

  useEffect(() => {
    if (!date ||!barberId ||!serviceId) return;
    setFetching(true);
    setSlots([]); setSelected("");
    axios.get("/api/booking/availability", { params: { date, barberId, serviceId } })
    .then(r => setSlots(r.data || []))
    .catch(() => toast.error("Impossible de charger les créneaux"))
    .finally(() => setFetching(false));
  }, [date, barberId, serviceId]);

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await axios.patch(`/api/booking/admin/${booking.id}`, {
        service_id: serviceId,
        barber_id: barberId,
        start_time: selected,
      });
      toast.success("Rendez-vous mis à jour!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur de mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="ab-modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div className="ab-modal"
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="ab-modal-close" onClick={onClose}>✕</button>
        <h3>Modifier le rendez-vous</h3>

        <div className="ab-client-panel" style={{ marginBottom: "1.5rem" }}>
          <div className="ab-client-name">{booking.client_name}</div>
          <div className="ab-client-meta">
            <span>✉ {booking.client_email}</span>
          </div>
        </div>

        <div className="ab-form-group">
          <label className="ab-label">Service</label>
          <select className="ab-select" value={serviceId} onChange={e => setServiceId(e.target.value)}>
            {services.map(s => <option key={s.id} value={s.id}>{s.name} — {s.duration} min — {s.price}$</option>)}
          </select>
        </div>

        <div className="ab-form-group">
          <label className="ab-label">Barbier</label>
          <select className="ab-select" value={barberId} onChange={e => setBarberId(e.target.value)}>
            {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div className="ab-form-group">
          <label className="ab-label">Nouvelle date</label>
          <input type="date" className="ab-input" value={date} min={getMinDate()} onChange={e => setDate(e.target.value)} />
        </div>

        {fetching && <p style={{ fontSize: "0.85rem", color: "var(--ab-muted)" }}>Chargement des créneaux…</p>}
        {!fetching && date && slots.length === 0 && <p style={{ fontSize: "0.85rem", color: "var(--ab-muted)", marginBottom: "1rem" }}>Aucun créneau disponible</p>}

        {slots.length > 0 && (
          <div className="ab-form-group">
            <label className="ab-label">Créneau</label>
            <div className="ab-slots">
              {slots.map(s => (
                <div key={s} className={`ab-slot ${selected === s? "selected" : ""}`} onClick={() => setSelected(s)}>
                  {fmtTime(s)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button className="ab-btn-outline" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
          <button className="ab-btn-gold" style={{ flex: 2 }} onClick={handleSave} disabled={!selected || loading}>
            {loading? "Enregistrement…" : "Enregistrer →"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ClientDetailModal = ({ booking, onClose }) => (
  <motion.div className="ab-modal-overlay"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div className="ab-modal"
      initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={e => e.stopPropagation()}
    >
      <button className="ab-modal-close" onClick={onClose}>✕</button>
      <h3>Détails de la réservation #{booking.id}</h3>

      <div className="ab-client-panel">
        <div className="ab-client-name">{booking.client_name}</div>
        <div className="ab-client-meta">
          {booking.client_email && <span>✉ <a href={`mailto:${booking.client_email}`} style={{ color: "var(--ab-gold)", textDecoration: "none" }}>{booking.client_email}</a></span>}
        </div>
      </div>

      <div style={{ background: "var(--ab-black)", border: "1px solid var(--ab-border)", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
        {[
          ["Service", booking.service_name],
          ["Barbier", booking.barber_name],
          ["Date", fmtDate(booking.start_time)],
          ["Heure", fmtTime(booking.start_time)],
          ["Durée", `${booking.duration?? "–"} min`],
          ["Prix", `${booking.price}$ CAD`],
          ["Statut", booking.status === "confirmed"? "Confirmé" : booking.status === "cancelled"? "Annulé" : "Terminé"],
          ["Réservé le", fmtDateTime(booking.created_at?? booking.start_time)],
        ].map(([k, v]) => (
          <div key={k} className="ab-summary-row">
            <span style={{ color: "var(--ab-muted)", fontSize: "0.85rem" }}>{k}</span>
            <span style={{ color: "var(--ab-cream)", fontSize: "0.88rem", fontWeight: 500, textAlign: "right" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        {booking.client_email && (
          <a href={`mailto:${booking.client_email}`} className="ab-btn-outline" style={{ flex: 1, textAlign: "center" }}>
            ✉ Contacter
          </a>
        )}
        <button className="ab-btn-gold" style={{ flex: 1 }} onClick={onClose}>Fermer</button>
      </div>
    </motion.div>
  </motion.div>
);

const BookingCard = ({ booking, onView, onReschedule, onComplete, onCancel }) => (
  <div className="ab-booking-card">
    <div className="ab-card-row">
      <span className="ab-card-label">ID</span>
      <span className="ab-card-value" style={{ color: "var(--ab-muted)" }}>#{booking.id}</span>
    </div>
    <div className="ab-card-row">
      <span className="ab-card-label">Client</span>
      <span className="ab-card-value">{booking.client_name}</span>
    </div>
    <div className="ab-card-row">
      <span className="ab-card-label">Date</span>
      <span className="ab-card-value">{fmtDateTime(booking.start_time)}</span>
    </div>
    <div className="ab-card-row">
      <span className="ab-card-label">Service</span>
      <span className="ab-card-value">{booking.service_name}</span>
    </div>
    <div className="ab-card-row">
      <span className="ab-card-label">Barbier</span>
      <span className="ab-card-value">{booking.barber_name}</span>
    </div>
    <div className="ab-card-row">
      <span className="ab-card-label">Prix</span>
      <span className="ab-card-value" style={{ color: "var(--ab-gold)", fontWeight: 600 }}>{booking.price}$</span>
    </div>
    <div className="ab-card-row">
      <span className="ab-card-label">Statut</span>
      <span className={`ab-status ${booking.status}`}>
        {booking.status === "confirmed"? "Confirmé" : booking.status === "cancelled"? "Annulé" : "Terminé"}
      </span>
    </div>
    <div className="ab-card-actions">
      <button onClick={() => onView(booking)} className="ab-icon-btn" title="Voir détails">👁</button>
      {booking.status === "confirmed" && (
        <>
          <button onClick={() => onReschedule(booking)} className="ab-icon-btn" title="Modifier">📅</button>
          <button onClick={() => onComplete(booking.id)} className="ab-icon-btn success" title="Terminer">✓</button>
          <button onClick={() => onCancel(booking.id)} className="ab-icon-btn danger" title="Annuler">✕</button>
        </>
      )}
    </div>
  </div>
);

//... reste du code helpers, modals, BookingCard déjà donné plus haut...

// ─── AdminDashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  useAdminStyles();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bookings");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterBarber, setFilterBarber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, revenue: 0, cancelled: 0 });

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes, barbersRes] = await Promise.all([
        axios.get("/api/booking/admin/all"),
        axios.get("/api/booking/services"),
        axios.get("/api/booking/barbers"),
      ]);
      setBookings(bookingsRes.data);
      setServices(servicesRes.data);
      setBarbers(barbersRes.data);
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
    const role = localStorage.getItem("role");
    if (!token || role!== "admin") { navigate("/login"); return; }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchInitialData();
  }, [navigate, fetchInitialData]);

  const calcStats = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    setStats({
      today: data.filter(b => b.start_time.startsWith(today) && b.status === "confirmed").length,
      week: data.filter(b => b.start_time >= weekAgo && b.status === "confirmed").length,
      month: data.filter(b => b.start_time >= monthAgo && b.status === "confirmed").length,
      cancelled: data.filter(b => b.start_time >= monthAgo && b.status === "cancelled").length,
      revenue: data.filter(b => b.start_time >= monthAgo && b.status === "completed").reduce((s, b) => s + parseFloat(b.price || 0), 0),
    });
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Annuler cette réservation?")) return;
    try {
      await axios.patch(`/api/booking/admin/${id}/cancel`);
      toast.success("Réservation annulée");
      fetchInitialData();
    } catch { toast.error("Erreur lors de l'annulation"); }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Marquer comme terminé?")) return;
    try {
      await axios.patch(`/api/booking/admin/${id}/complete`);
      toast.success("Réservation marquée comme terminée");
      fetchInitialData();
    } catch { toast.error("Erreur"); }
  };

  const filtered = bookings.filter(b => {
    const matchDate =!filterDate || b.start_time.startsWith(filterDate);
    const matchBarber =!filterBarber || b.barber_id?.toString() === filterBarber;
    const matchStatus =!filterStatus || b.status === filterStatus;
    const matchSearch =!search || [b.client_name, b.service_name, b.barber_name, String(b.id)]
    .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    return matchDate && matchBarber && matchStatus && matchSearch;
  });

  const menuItems = [
    { id: "bookings", label: "Réservations", icon: "📅" },
    { id: "clients", label: "Clients", icon: "👥" },
    { id: "barbers", label: "Barbiers", icon: "✂" },
    { id: "services", label: "Services", icon: "💈" },
    { id: "stats", label: "Statistiques", icon: "📊" },
    { id: "chat", label: "Chat Live", icon: "💬" },
    { id: "settings", label: "Paramètres", icon: "⚙" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "bookings": return (
        <>
          <div className="ad-header">
            <p className="ad-eyebrow">Administration</p>
            <h1 className="ad-display">Gestion des Réservations</h1>
            <span className="ab-gold-rule" />
          </div>

          <div className="ab-stats">
            {[
              { label: "Aujourd'hui", val: stats.today, sub: "confirmés" },
              { label: "Cette semaine", val: stats.week, sub: "confirmés" },
              { label: "Ce mois", val: stats.month, sub: "confirmés" },
              { label: "Annulés/mois", val: stats.cancelled, sub: "ce mois" },
              { label: "Revenus/mois", val: `${stats.revenue.toFixed(0)}$`, sub: "terminés" },
            ].map(({ label, val, sub }) => (
              <div key={label} className="ab-stat-card">
                <div className="ab-stat-label">{label}</div>
                <div className="ab-stat-value">{val}</div>
                <div className="ab-stat-sub">{sub}</div>
              </div>
            ))}
          </div>

          <button className="ab-filters-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
            {filtersOpen? "▲ Masquer filtres" : "▼ Afficher filtres"}
          </button>

          <div className={`ab-filters ${filtersOpen? 'show' : ''}`}>
            <div>
              <label className="ab-label">Recherche</label>
              <div className="ab-search-wrap">
                <span className="ab-search-icon">🔍</span>
                <input
                  className="ab-input"
                  placeholder="Client, service, barbier, #ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="ab-label">Date</label>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="ab-input" />
            </div>
            <div>
              <label className="ab-label">Barbier</label>
              <select value={filterBarber} onChange={e => setFilterBarber(e.target.value)} className="ab-select">
                <option value="">Tous</option>
                {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
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
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={() => { setFilterDate(""); setFilterBarber(""); setFilterStatus(""); setSearch(""); setFiltersOpen(false); }}
                className="ab-btn-outline" style={{ width: "100%" }}
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {error && <div className="ab-error">{error}</div>}

          <p style={{ fontSize: "0.8rem", color: "var(--ab-muted)", marginBottom: "1rem" }}>
            {filtered.length} réservation{filtered.length!== 1? "s" : ""} affichée{filtered.length!== 1? "s" : ""}
          </p>

          {loading? (
            <p style={{ textAlign: "center", padding: "4rem", color: "var(--ab-muted)" }}>Chargement…</p>
          ) : filtered.length === 0? (
            <div className="ab-empty">Aucune réservation trouvée</div>
          ) : (
            <>
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
                            {b.status === "confirmed"? "Confirmé" : b.status === "cancelled"? "Annulé" : "Terminé"}
                          </span>
                        </td>
                        <td>
                          <div className="ab-actions">
                            <button onClick={() => setDetailTarget(b)} className="ab-icon-btn" title="Voir détails">👁</button>
                            {b.status === "confirmed" && (
                              <>
                                <button onClick={() => setRescheduleTarget(b)} className="ab-icon-btn" title="Modifier / Reporter">📅</button>
                                <button onClick={() => handleComplete(b.id)} className="ab-icon-btn success" title="Marquer terminé">✓</button>
                                <button onClick={() => handleCancel(b.id)} className="ab-icon-btn danger" title="Annuler">✕</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onView={setDetailTarget}
                  onReschedule={setRescheduleTarget}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />
              ))}
            </>
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
        return (<><div className="ad-header"><p className="ad-eyebrow">Gestion</p><h1 className="ad-display">Clients</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Clients en développement…</p></>);
      case "barbers":
        return (<><div className="ad-header"><p className="ad-eyebrow">Équipe</p><h1 className="ad-display">Barbiers</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Barbiers en développement…</p></>);
      case "services":
        return (<><div className="ad-header"><p className="ad-eyebrow">Catalogue</p><h1 className="ad-display">Services</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Services en développement…</p></>);
      case "stats":
        return (<><div className="ad-header"><p className="ad-eyebrow">Analytics</p><h1 className="ad-display">Statistiques</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Statistiques en développement…</p></>);
      case "settings":
        return (<><div className="ad-header"><p className="ad-eyebrow">Configuration</p><h1 className="ad-display">Paramètres</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Paramètres en développement…</p></>);
      default: return null;
    }
  };

  return (
    <div className="ad-root">
      <button className="ad-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
      <div className={`ad-overlay ${mobileMenuOpen? "show" : ""}`} onClick={() => setMobileMenuOpen(false)} />

      <aside className={`ad-sidebar ${mobileMenuOpen? "open" : ""}`}>
        <div className="ad-logo">
          <div className="ad-logo-title">Mr. Renaudin</div>
          <div className="ad-logo-sub">Admin Panel</div>
        </div>
        <nav className="ad-nav">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`ad-nav-item ${activeTab === item.id? "active" : ""}`}
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
        {rescheduleTarget && (
          <AdminRescheduleModal
            booking={rescheduleTarget}
            services={services}
            barbers={barbers}
            onClose={() => setRescheduleTarget(null)}
            onSuccess={fetchInitialData}
          />
        )}
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