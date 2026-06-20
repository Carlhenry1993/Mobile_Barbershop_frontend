import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
// ToastContainer géré globalement dans App.js

// ─── Config ───────────────────────────────────────────────────────────────────
axios.defaults.baseURL = "https://mobile-barbershop-backend.onrender.com";

// ─── Styles ───────────────────────────────────────────────────────────────────
const useMyBookingsStyles = () => {
  useEffect(() => {
    const id = "mrr-my-bookings-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      .mb-root {
        --mb-black:   #0a0b0e;
        --mb-surface: #12141a;
        --mb-card:    #181c24;
        --mb-border:  rgba(212,168,67,0.12);
        --mb-gold:    #d4a843;
        --mb-gold-lt: #f0c96a;
        --mb-gold-dim:rgba(212,168,67,0.08);
        --mb-cream:   #ede8de;
        --mb-fog:     #8e97aa;
        --mb-mist:    #b8c0d0;
        --mb-success: #27ae60;
        --mb-danger:  #e74c3c;
        --mb-warn:    #f59e0b;

        background: var(--mb-black);
        color: var(--mb-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100svh;
      }

      /* ── Layout ── */
      .mb-wrap { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
      .mb-sect { padding: 5rem 1.5rem 3rem; }
      @media (max-width: 640px) { .mb-sect { padding: 3.5rem 1.25rem 2rem; } }

      /* ── Page header ── */
      .mb-eyebrow {
        font-size: 0.68rem; letter-spacing: 0.25em;
        text-transform: uppercase; color: var(--mb-gold); margin-bottom: 0.75rem;
      }
      .mb-display {
        font-family: 'Playfair Display', serif;
        font-weight: 900; line-height: 1.05;
        font-size: clamp(2rem, 5vw, 3rem); color: var(--mb-cream);
      }
      .mb-rule { display: block; width: 50px; height: 2px; background: var(--mb-gold); margin: 1.25rem 0 2.5rem; }

      /* ── Notice ── */
      .mb-notice {
        padding: 0.9rem 1.25rem;
        background: var(--mb-gold-dim); border-left: 2px solid var(--mb-gold);
        font-size: 0.82rem; color: var(--mb-mist); margin-bottom: 2rem; line-height: 1.65;
      }

      /* ── Tabs ── */
      .mb-tabs {
        display: flex; gap: 0; flex-wrap: wrap;
        border-bottom: 1px solid var(--mb-border); margin-bottom: 2rem;
      }
      .mb-tab {
        padding: 0.75rem 1.5rem;
        font-size: 0.78rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
        background: none; border: none; color: var(--mb-fog); cursor: pointer;
        border-bottom: 2px solid transparent; margin-bottom: -1px;
        transition: color 0.2s, border-color 0.2s;
        display: flex; align-items: center; gap: 0.5rem;
      }
      .mb-tab:hover { color: var(--mb-cream); }
      .mb-tab.active { color: var(--mb-gold); border-bottom-color: var(--mb-gold); }
      .mb-tab-badge {
        display: inline-flex; align-items: center; justify-content: center;
        width: 20px; height: 20px; border-radius: 50%;
        background: var(--mb-gold-dim); color: var(--mb-gold);
        font-size: 0.68rem; font-weight: 700;
      }

      /* ── Booking card ── */
      .mb-card {
        background: var(--mb-card); border: 1px solid var(--mb-border);
        padding: 1.75rem 2rem; margin-bottom: 0.85rem;
        transition: border-color 0.22s; position: relative;
      }
      .mb-card:hover { border-color: rgba(212,168,67,0.3); }
      .mb-card-top {
        display: flex; align-items: flex-start;
        justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
      }
      .mb-card-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.15rem; font-weight: 700; color: var(--mb-cream); margin-bottom: 0.5rem;
      }
      .mb-card-meta {
        display: flex; flex-wrap: wrap; gap: 0.4rem 1.25rem; margin-top: 0.5rem;
      }
      .mb-meta-item {
        display: flex; align-items: center; gap: 0.35rem;
        font-size: 0.82rem; color: var(--mb-mist);
      }
      .mb-meta-icon { color: var(--mb-gold); }

      /* ── Status badge ── */
      .mb-badge {
        display: inline-flex; align-items: center; gap: 0.3rem;
        padding: 0.28rem 0.8rem;
        font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        flex-shrink: 0;
      }
      .mb-badge.confirmed { background: rgba(39,174,96,0.1); color: #4cde80; border: 1px solid rgba(39,174,96,0.22); }
      .mb-badge.cancelled { background: rgba(231,76,60,0.1); color: #ff8a7a; border: 1px solid rgba(231,76,60,0.22); }
      .mb-badge.completed { background: rgba(139,168,200,0.1); color: #8ba8c8; border: 1px solid rgba(139,168,200,0.22); }

      /* ── Countdown ── */
      .mb-countdown { font-size: 0.76rem; color: var(--mb-fog); margin-top: 0.5rem; }
      .mb-countdown.urgent { color: var(--mb-warn); font-weight: 600; }
      .mb-countdown.past   { opacity: 0.5; }

      /* ── Card actions ── */
      .mb-actions {
        display: flex; gap: 0.6rem; flex-wrap: wrap;
        margin-top: 1.25rem; padding-top: 1.25rem;
        border-top: 1px solid var(--mb-border);
      }
      .mb-btn {
        display: inline-flex; align-items: center; gap: 0.4rem;
        padding: 0.6rem 1.2rem;
        font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
        border: none; cursor: pointer;
        transition: background 0.2s, transform 0.15s, opacity 0.2s; will-change: transform;
      }
      .mb-btn:hover:not(:disabled) { transform: translateY(-1px); }
      .mb-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      .mb-btn-gold  { background: var(--mb-gold); color: var(--mb-black); }
      .mb-btn-gold:hover:not(:disabled) { background: var(--mb-gold-lt); }
      .mb-btn-ghost { background: transparent; color: var(--mb-mist); border: 1px solid rgba(184,192,208,0.18); }
      .mb-btn-ghost:hover:not(:disabled) { border-color: var(--mb-gold); color: var(--mb-gold); }
      .mb-btn-danger { background: transparent; color: #ff8a7a; border: 1px solid rgba(231,76,60,0.22); }
      .mb-btn-danger:hover:not(:disabled) { background: rgba(231,76,60,0.08); border-color: var(--mb-danger); }

      /* ── Empty state ── */
      .mb-empty { text-align: center; padding: 5rem 2rem; color: var(--mb-fog); }
      .mb-empty-icon { font-size: 3rem; opacity: 0.2; margin-bottom: 1.25rem; }
      .mb-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.35rem; color: var(--mb-cream); margin-bottom: 0.75rem; }
      .mb-empty p  { font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.75rem; }

      /* ── Skeleton loader ── */
      .mb-skel {
        background: linear-gradient(90deg, var(--mb-card) 25%, #1e2535 50%, var(--mb-card) 75%);
        background-size: 200% 100%;
        animation: mbShimmer 1.4s ease-in-out infinite;
        height: 130px; margin-bottom: 0.85rem;
      }
      @keyframes mbShimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* ── Modal overlay ── */
      .mb-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.84);
        z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;
      }
      .mb-modal {
        background: var(--mb-card); border: 1px solid var(--mb-border);
        padding: 2.5rem; width: 100%; max-width: 500px;
        max-height: 90vh; overflow-y: auto; position: relative;
      }
      .mb-modal-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.45rem; color: var(--mb-cream); margin-bottom: 0.4rem;
      }
      .mb-modal-sub { font-size: 0.82rem; color: var(--mb-fog); margin-bottom: 1.75rem; }
      .mb-modal-close {
        position: absolute; top: 1.25rem; right: 1.25rem;
        background: none; border: none; color: var(--mb-fog);
        font-size: 1.3rem; cursor: pointer; transition: color 0.2s; line-height: 1;
      }
      .mb-modal-close:hover { color: var(--mb-cream); }

      /* ── Modal form ── */
      .mb-field { margin-bottom: 1.4rem; }
      .mb-label {
        display: block; font-size: 0.72rem; font-weight: 600;
        letter-spacing: 0.08em; text-transform: uppercase;
        color: var(--mb-fog); margin-bottom: 0.55rem;
      }
      .mb-input {
        width: 100%; padding: 0.88rem 1rem;
        background: var(--mb-black); border: 1px solid rgba(184,192,208,0.14);
        color: var(--mb-cream); font-size: 0.92rem; font-family: 'DM Sans', sans-serif;
        transition: border-color 0.2s, box-shadow 0.2s; outline: none;
      }
      .mb-input:focus { border-color: var(--mb-gold); box-shadow: 0 0 0 3px rgba(212,168,67,0.1); }

      /* ── Slot grid in modal ── */
      .mb-slots {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
        gap: 0.5rem; margin-top: 0.6rem;
      }
      .mb-slot {
        padding: 0.6rem; text-align: center;
        background: var(--mb-black); border: 1px solid rgba(184,192,208,0.12);
        color: var(--mb-mist); font-size: 0.82rem; cursor: pointer; transition: all 0.18s;
      }
      .mb-slot:hover { border-color: var(--mb-gold); color: var(--mb-cream); }
      .mb-slot.selected { background: var(--mb-gold); color: var(--mb-black); border-color: var(--mb-gold); font-weight: 700; }

      /* ── Cancel confirm box ── */
      .mb-danger-box {
        background: rgba(231,76,60,0.07); border: 1px solid rgba(231,76,60,0.2);
        padding: 1.1rem 1.4rem; margin-bottom: 1.5rem;
        font-size: 0.85rem; color: var(--mb-mist); line-height: 1.65;
      }
      .mb-danger-box strong { color: #ff8a7a; }

      /* ── Summary rows in modal ── */
      .mb-sum-row {
        display: flex; justify-content: space-between;
        padding: 0.6rem 0; border-bottom: 1px solid var(--mb-border);
        font-size: 0.85rem;
      }
      .mb-sum-row:last-child { border-bottom: none; }
      .mb-sum-key { color: var(--mb-fog); }
      .mb-sum-val { color: var(--mb-cream); font-weight: 500; text-align: right; }

      /* ── Modal btn row ── */
      .mb-modal-btns { display: flex; gap: 0.75rem; margin-top: 2rem; }

      /* ── Loading inline ── */
      .mb-loading {
        display: flex; align-items: center; justify-content: center; gap: 0.6rem;
        color: var(--mb-fog); font-size: 0.85rem; padding: 1.5rem 0;
      }
      .mb-spinner {
        width: 16px; height: 16px; border-radius: 50%;
        border: 2px solid rgba(212,168,67,0.18); border-top-color: var(--mb-gold);
        animation: mbSpin 0.7s linear infinite; flex-shrink: 0;
      }
      @keyframes mbSpin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtLong  = (d) => new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtShort = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const fmtTime  = (d) => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const canModify = (booking) => {
  if (booking.status !== "confirmed") return false;
  return new Date(booking.start_time) - new Date() > 24 * 60 * 60 * 1000;
};

const getCountdown = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  if (h < 24) return { label: `Dans ${h}h`, urgent: true };
  const d = Math.floor(h / 24);
  return { label: `Dans ${d} jour${d > 1 ? "s" : ""}`, urgent: false };
};

const STATUS_LABEL = { confirmed: "Confirmé", cancelled: "Annulé", completed: "Terminé" };
const STATUS_ICON  = { confirmed: "●", cancelled: "✕", completed: "✓" };

// ─── RescheduleModal ──────────────────────────────────────────────────────────
const RescheduleModal = ({ booking, onClose, onSuccess }) => {
  const shouldReduceMotion = useReducedMotion();
  const [date,     setDate]     = useState("");
  const [slots,    setSlots]    = useState([]);
  const [selected, setSelected] = useState("");
  const [fetching, setFetching] = useState(false);
  const [loading,  setLoading]  = useState(false);

  // Fetch slots when date changes
  useEffect(() => {
    if (!date) return;
    setFetching(true);
    setSlots([]);
    setSelected("");
    axios
      .get("/api/booking/availability", {
        params: {
          date,
          barberId:  booking.barber_id,
          serviceId: booking.service_id,
        },
      })
      .then((r) => setSlots(r.data || []))
      .catch(() => toast.error("Impossible de charger les créneaux"))
      .finally(() => setFetching(false));
  }, [date, booking.barber_id, booking.service_id]);

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await axios.patch(`/api/booking/${booking.id}`, { startTime: selected });
      toast.success("Rendez-vous reporté avec succès !");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur lors du report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mb-overlay"
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="mb-modal"
        initial={shouldReduceMotion ? {} : { scale: 0.94, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={shouldReduceMotion ? {} : { scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="mb-modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        <h2 className="mb-modal-title">Reporter le rendez-vous</h2>
        <p className="mb-modal-sub">
          {booking.service_name} · {fmtShort(booking.start_time)} à {fmtTime(booking.start_time)}
        </p>

        <div style={{ padding: "0.85rem 1.1rem", background: "var(--mb-gold-dim)", borderLeft: "2px solid var(--mb-gold)", fontSize: "0.8rem", color: "var(--mb-mist)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          Report gratuit jusqu'à <strong>24h avant</strong> le rendez-vous.
          Le service et le barbier restent les mêmes.
        </div>

        <div className="mb-field">
          <label className="mb-label">Nouvelle date</label>
          <input
            type="date"
            className="mb-input"
            value={date}
            min={getMinDate()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {fetching && (
          <div className="mb-loading"><div className="mb-spinner" /> Chargement des créneaux…</div>
        )}
        {!fetching && date && slots.length === 0 && (
          <p style={{ fontSize: "0.82rem", color: "var(--mb-fog)", marginBottom: "1rem" }}>
            Aucun créneau disponible ce jour-là.
          </p>
        )}
        {slots.length > 0 && (
          <div className="mb-field">
            <label className="mb-label">Choisir l'heure</label>
            <div className="mb-slots">
              {slots.map((s) => (
                <div
                  key={s}
                  className={`mb-slot ${selected === s ? "selected" : ""}`}
                  onClick={() => setSelected(s)}
                >
                  {fmtTime(s)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-modal-btns">
          <button className="mb-btn mb-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
          <button
            className="mb-btn mb-btn-gold" style={{ flex: 2 }}
            onClick={handleConfirm}
            disabled={!selected || loading}
          >
            {loading ? <><div className="mb-spinner" style={{ width: 14, height: 14 }} /> Enregistrement…</> : "Confirmer le report →"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── CancelModal ──────────────────────────────────────────────────────────────
const CancelModal = ({ booking, onClose, onSuccess }) => {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/booking/${booking.id}`);
      toast.success("Rendez-vous annulé.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Impossible d'annuler ce rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="mb-overlay"
      initial={shouldReduceMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="mb-modal"
        initial={shouldReduceMotion ? {} : { scale: 0.94, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={shouldReduceMotion ? {} : { scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="mb-modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        <h2 className="mb-modal-title">Annuler le rendez-vous</h2>
        <p className="mb-modal-sub">
          {booking.service_name} · {fmtShort(booking.start_time)}
        </p>

        <div className="mb-danger-box">
          <strong>Attention</strong> — Cette action est irréversible. Vous annulez votre rendez-vous du{" "}
          <strong style={{ color: "var(--mb-cream)" }}>{fmtLong(booking.start_time)}</strong> à{" "}
          <strong style={{ color: "var(--mb-cream)" }}>{fmtTime(booking.start_time)}</strong>.
          <br /><br />
          L'annulation est gratuite jusqu'à <strong>24h avant</strong>.
        </div>

        <div style={{ background: "var(--mb-black)", border: "1px solid var(--mb-border)", padding: "0.5rem 1.25rem", marginBottom: "1.5rem" }}>
          {[
            ["Service", booking.service_name],
            ["Barbier", booking.barber_name],
            ["Date",    fmtLong(booking.start_time)],
            ["Heure",   fmtTime(booking.start_time)],
            ["Montant", `${booking.price}$ CAD`],
          ].map(([k, v]) => (
            <div key={k} className="mb-sum-row">
              <span className="mb-sum-key">{k}</span>
              <span className="mb-sum-val">{v}</span>
            </div>
          ))}
        </div>

        <div className="mb-modal-btns">
          <button className="mb-btn mb-btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            Garder le RDV
          </button>
          <button
            className="mb-btn mb-btn-danger" style={{ flex: 1 }}
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? <><div className="mb-spinner" style={{ width: 14, height: 14 }} /> Annulation…</> : "Oui, annuler"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── BookingCard ──────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onReschedule, onCancel, onReview }) => {
  const modifiable = canModify(booking);
  const countdown  = getCountdown(booking.start_time);
  const isPast     = new Date(booking.start_time) < new Date();

  return (
    <motion.div
      className="mb-card"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-card-top">
        {/* Left: info */}
        <div style={{ flex: 1 }}>
          <div className="mb-card-title">{booking.service_name}</div>
          <div className="mb-card-meta">
            <span className="mb-meta-item"><span className="mb-meta-icon">✂️</span>{booking.barber_name}</span>
            <span className="mb-meta-item"><span className="mb-meta-icon">📅</span>{fmtLong(booking.start_time)}</span>
            <span className="mb-meta-item"><span className="mb-meta-icon">🕐</span>{fmtTime(booking.start_time)}</span>
            <span className="mb-meta-item"><span className="mb-meta-icon">⏱</span>{booking.duration} min</span>
            <span className="mb-meta-item"><span className="mb-meta-icon">💰</span>{booking.price}$ CAD</span>
          </div>
          {countdown && (
            <div className={`mb-countdown ${countdown.urgent ? "urgent" : ""}`}>
              {countdown.urgent ? "⚠ " : "◷ "}{countdown.label}
            </div>
          )}
          {isPast && booking.status === "confirmed" && (
            <div className="mb-countdown past">Rendez-vous passé</div>
          )}
        </div>

        {/* Right: status badge */}
        <span className={`mb-badge ${booking.status}`}>
          {STATUS_ICON[booking.status]}{" "}
          {STATUS_LABEL[booking.status] || booking.status}
        </span>
      </div>

      {/* Actions — only for upcoming confirmed */}
      {booking.status === "confirmed" && !isPast && (
        <div className="mb-actions">
          {modifiable ? (
            <>
              <button className="mb-btn mb-btn-gold" onClick={() => onReschedule(booking)}>
                📅 Reporter
              </button>
              <button className="mb-btn mb-btn-ghost" onClick={() => onReschedule(booking)}>
                ✎ Changer la date
              </button>
              <button className="mb-btn mb-btn-danger" onClick={() => onCancel(booking)}>
                ✕ Annuler
              </button>
            </>
          ) : (
            <p style={{ fontSize: "0.76rem", color: "var(--mb-fog)", fontStyle: "italic" }}>
              ⚠ Modification impossible — moins de 24h avant le rendez-vous.
            </p>
          )}
        </div>
      )}

      {booking.status === "completed" && (
        <div className="mb-actions">
          <button className="mb-btn mb-btn-gold" onClick={() => onReview(booking)}>
            Donner mon avis
          </button>
        </div>
      )}
    </motion.div>
  );
};

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (comment.trim().length < 8) {
      toast.error("Ajoutez un commentaire un peu plus complet.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/reviews", {
        bookingId: booking.id,
        rating,
        title,
        comment,
      });
      toast.success("Merci pour votre avis !");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Impossible d'envoyer votre avis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="mb-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.form
        className="mb-modal"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <button type="button" className="mb-modal-close" onClick={onClose}>×</button>
        <h3>Votre avis apres la coupe</h3>
        <p style={{ color: "var(--mb-fog)", lineHeight: 1.6, marginBottom: "1rem" }}>
          {booking.service_name} avec {booking.barber_name}
        </p>

        <label className="mb-label">Note</label>
        <div style={{ display: "flex", gap: "0.35rem", marginBottom: "1rem" }}>
          {[1, 2, 3, 4, 5].map(value => (
            <button
              type="button"
              key={value}
              onClick={() => setRating(value)}
              style={{
                background: "transparent",
                border: "1px solid var(--mb-border)",
                color: value <= rating ? "var(--mb-gold)" : "var(--mb-fog)",
                padding: "0.55rem 0.7rem",
                cursor: "pointer",
                fontSize: "1.05rem",
              }}
            >
              ★
            </button>
          ))}
        </div>

        <label className="mb-label">Titre optionnel</label>
        <input className="mb-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Coupe impeccable" />

        <label className="mb-label" style={{ marginTop: "1rem" }}>Commentaire</label>
        <textarea className="mb-input" rows="5" value={comment} onChange={e => setComment(e.target.value)} placeholder="Dites ce que vous avez apprecie..." />

        <div className="mb-modal-btns">
          <button type="button" className="mb-btn mb-btn-ghost" onClick={onClose}>Annuler</button>
          <button type="submit" className="mb-btn mb-btn-gold" disabled={loading}>
            {loading ? "Envoi..." : "Publier mon avis"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

// ─── MyBookingsPage ───────────────────────────────────────────────────────────
const MyBookingsPage = () => {
  useMyBookingsStyles();
  const navigate = useNavigate();

  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("upcoming");
  const [reschedule, setReschedule] = useState(null);
  const [cancel,     setCancel]     = useState(null);
  const [review,     setReview]     = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get("/api/booking/my-bookings");
      setBookings(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else toast.error("Impossible de charger vos réservations");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // ── Filter by tab ──────────────────────────────────────────────────────────
  const now = new Date();
  const upcoming  = bookings.filter((b) => b.status === "confirmed" && new Date(b.start_time) > now);
  const past      = bookings.filter((b) => b.status === "completed" || (b.status === "confirmed" && new Date(b.start_time) <= now));
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const displayed = tab === "upcoming" ? upcoming : tab === "past" ? past : cancelled;

  const TABS = [
    { key: "upcoming",  label: "À venir",  count: upcoming.length },
    { key: "past",      label: "Passés",   count: past.length },
    { key: "cancelled", label: "Annulés",  count: cancelled.length },
  ];

  return (
    <div className="mb-root">
      <section className="mb-sect">
        <div className="mb-wrap">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-eyebrow">Espace client</p>
            <h1 className="mb-display">Mes Rendez-vous</h1>
            <span className="mb-rule" />
          </motion.div>

          {/* Notice */}
          <div className="mb-notice">
            Modification et annulation gratuites jusqu'à{" "}
            <strong style={{ color: "var(--mb-gold)" }}>24h avant</strong> votre rendez-vous.
            Pour toute urgence :{" "}
            <a href="tel:514-778-8318" style={{ color: "var(--mb-gold)", textDecoration: "none" }}>514-778-8318</a>.
          </div>

          {/* Tabs */}
          <div className="mb-tabs">
            {TABS.map(({ key, label, count }) => (
              <button
                key={key}
                className={`mb-tab ${tab === key ? "active" : ""}`}
                onClick={() => setTab(key)}
              >
                {label}
                {count > 0 && <span className="mb-tab-badge">{count}</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div>{[1, 2, 3].map((i) => <div key={i} className="mb-skel" />)}</div>
          ) : displayed.length === 0 ? (
            <div className="mb-empty">
              <div className="mb-empty-icon">
                {tab === "upcoming" ? "📅" : tab === "past" ? "✓" : "✕"}
              </div>
              <h3>
                {tab === "upcoming"
                  ? "Aucun rendez-vous à venir"
                  : tab === "past"
                  ? "Aucun rendez-vous passé"
                  : "Aucun rendez-vous annulé"}
              </h3>
              <p>
                {tab === "upcoming"
                  ? "Vous n'avez pas encore de rendez-vous planifié. Réservez maintenant en quelques clics."
                  : "Rien à afficher ici pour le moment."}
              </p>
              {tab === "upcoming" && (
                <button className="mb-btn mb-btn-gold" onClick={() => navigate("/reserver")}>
                  Prendre un rendez-vous →
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayed.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onReschedule={setReschedule}
                  onCancel={setCancel}
                  onReview={setReview}
                />
              ))}
            </AnimatePresence>
          )}

          {/* Bottom CTA when there are upcoming bookings */}
          {!loading && tab === "upcoming" && upcoming.length > 0 && (
            <motion.div
              style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--mb-border)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <button className="mb-btn mb-btn-gold" onClick={() => navigate("/reserver")}>
                + Ajouter un rendez-vous
              </button>
            </motion.div>
          )}

        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {reschedule && (
          <RescheduleModal
            booking={reschedule}
            onClose={() => setReschedule(null)}
            onSuccess={fetchBookings}
          />
        )}
        {cancel && (
          <CancelModal
            booking={cancel}
            onClose={() => setCancel(null)}
            onSuccess={fetchBookings}
          />
        )}
        {review && (
          <ReviewModal
            booking={review}
            onClose={() => setReview(null)}
            onSuccess={fetchBookings}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookingsPage;
