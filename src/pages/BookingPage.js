import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
import apiClient from "../lib/apiClient";
// ToastContainer géré globalement dans App.js

// ─── Config ───────────────────────────────────────────────────────────────────
const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7";

// ─── Styles ───────────────────────────────────────────────────────────────────
const useBookingStyles = () => {
  useEffect(() => {
    const id = "mrr-booking-styles";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = `
      .bk-root {
        --bk-black:    #0a0b0e;
        --bk-surface:  #12141a;
        --bk-card:     #181c24;
        --bk-border:   rgba(212,168,67,0.12);
        --bk-gold:     #d4a843;
        --bk-gold-lt:  #f0c96a;
        --bk-gold-dim: rgba(212,168,67,0.08);
        --bk-cream:    #ede8de;
        --bk-fog:      #8e97aa;
        --bk-mist:     #b8c0d0;
        --bk-success:  #27ae60;
        --bk-danger:   #e74c3c;

        background: var(--bk-black);
        color: var(--bk-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100svh;
      }

      /* ── Layout ── */
      .bk-wrap { max-width: 780px; margin: 0 auto; padding: 0 1.5rem; }
      .bk-sect { padding: 5rem 1.5rem 4rem; }
      @media (max-width: 640px) { .bk-sect { padding: 3.5rem 1.25rem 3rem; } }

      /* ── Page header ── */
      .bk-eyebrow {
        font-size: 0.68rem; letter-spacing: 0.25em;
        text-transform: uppercase; color: var(--bk-gold); margin-bottom: 0.75rem;
      }
      .bk-display {
        font-family: 'Playfair Display', serif;
        font-weight: 900; line-height: 1.05;
        font-size: clamp(2rem, 5vw, 3rem); color: var(--bk-cream);
      }
      .bk-rule {
        display: block; width: 50px; height: 2px;
        background: var(--bk-gold); margin: 1.25rem 0 3rem;
      }

      /* ── Step indicator ── */
      .bk-steps {
        display: flex; align-items: center;
        gap: 0; margin-bottom: 3rem;
        overflow-x: auto; padding-bottom: 0.25rem;
      }
      .bk-step-item {
        display: flex; align-items: center; flex-shrink: 0;
      }
      .bk-step-dot {
        display: flex; align-items: center; gap: 0.6rem;
        font-size: 0.75rem; font-weight: 600;
        letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--bk-fog); white-space: nowrap;
      }
      .bk-step-num {
        width: 30px; height: 30px; border-radius: 50%;
        border: 1px solid currentColor;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.75rem; font-weight: 700;
        flex-shrink: 0; transition: all 0.25s;
      }
      .bk-step-dot.active  { color: var(--bk-gold); }
      .bk-step-dot.active .bk-step-num {
        background: var(--bk-gold); color: var(--bk-black); border-color: var(--bk-gold);
      }
      .bk-step-dot.done { color: var(--bk-success); }
      .bk-step-dot.done .bk-step-num {
        background: rgba(39,174,96,0.15); border-color: var(--bk-success);
      }
      .bk-step-line {
        flex: 1; height: 1px; min-width: 24px; max-width: 48px;
        background: var(--bk-border); margin: 0 0.5rem;
      }
      .bk-step-line.done { background: var(--bk-success); opacity: 0.4; }

      /* ── Section title ── */
      .bk-section-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.35rem; color: var(--bk-cream);
        margin-bottom: 1.5rem; font-weight: 700;
      }

      /* ── Service card ── */
      .bk-service-card {
        background: var(--bk-card); border: 1px solid var(--bk-border);
        padding: 1.5rem; cursor: pointer;
        transition: border-color 0.22s, transform 0.22s, background 0.22s;
        will-change: transform;
        display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      }
      .bk-service-card:hover { border-color: rgba(212,168,67,0.4); transform: translateX(4px); }
      .bk-service-card.selected {
        border-color: var(--bk-gold); background: var(--bk-gold-dim);
      }
      .bk-service-name {
        font-family: 'Playfair Display', serif;
        font-size: 1.05rem; font-weight: 700; color: var(--bk-cream);
        margin-bottom: 0.3rem;
      }
      .bk-service-meta {
        font-size: 0.82rem; color: var(--bk-fog);
        display: flex; gap: 1rem; flex-wrap: wrap;
      }
      .bk-service-price {
        font-family: 'Playfair Display', serif;
        font-size: 1.3rem; font-weight: 700;
        color: var(--bk-gold); flex-shrink: 0;
      }

      /* ── Barber card ── */
      .bk-barbers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      .bk-barber-card {
        background: var(--bk-card); border: 1px solid var(--bk-border);
        padding: 1.5rem; cursor: pointer; text-align: center;
        transition: border-color 0.22s, transform 0.22s, background 0.22s;
        will-change: transform;
      }
      .bk-barber-card:hover { border-color: rgba(212,168,67,0.4); transform: translateY(-3px); }
      .bk-barber-card.selected { border-color: var(--bk-gold); background: var(--bk-gold-dim); }
      .bk-barber-avatar {
        width: 72px; height: 72px; border-radius: 50%;
        object-fit: cover; margin: 0 auto 1rem;
        border: 2px solid var(--bk-border); display: block;
      }
      .bk-barber-initials {
        width: 72px; height: 72px; border-radius: 50%;
        background: var(--bk-gold-dim); border: 2px solid var(--bk-border);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1rem;
        font-family: 'Playfair Display', serif;
        font-size: 1.3rem; font-weight: 700; color: var(--bk-gold);
      }
      .bk-barber-name {
        font-weight: 600; font-size: 0.95rem; color: var(--bk-cream);
        margin-bottom: 0.3rem;
      }
      .bk-barber-spec { font-size: 0.75rem; color: var(--bk-fog); line-height: 1.5; }

      /* ── Date + slots ── */
      .bk-date-input {
        width: 100%; padding: 0.9rem 1rem;
        background: var(--bk-black); border: 1px solid rgba(184,192,208,0.15);
        color: var(--bk-cream); font-size: 0.95rem; font-family: 'DM Sans', sans-serif;
        transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        margin-bottom: 1.75rem;
      }
      .bk-date-input:focus {
        border-color: var(--bk-gold);
        box-shadow: 0 0 0 3px rgba(212,168,67,0.1);
      }
      .bk-slots {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
        gap: 0.6rem;
      }
      .bk-slot {
        padding: 0.7rem; text-align: center;
        background: var(--bk-black); border: 1px solid rgba(184,192,208,0.12);
        color: var(--bk-mist); font-size: 0.88rem;
        cursor: pointer; transition: all 0.18s;
      }
      .bk-slot:hover { border-color: var(--bk-gold); color: var(--bk-cream); }
      .bk-slot.selected {
        background: var(--bk-gold); color: var(--bk-black);
        border-color: var(--bk-gold); font-weight: 700;
      }
      .bk-no-slots {
        text-align: center; padding: 2.5rem;
        color: var(--bk-fog); font-size: 0.88rem;
        border: 1px dashed rgba(184,192,208,0.1);
      }

      /* ── Confirmation summary ── */
      .bk-summary {
        background: var(--bk-card); border: 1px solid var(--bk-border);
        margin-bottom: 2rem; overflow: hidden;
      }
      .bk-summary-header {
        background: var(--bk-gold-dim); border-bottom: 1px solid var(--bk-border);
        padding: 1rem 1.5rem;
        font-size: 0.72rem; letter-spacing: 0.15em;
        text-transform: uppercase; color: var(--bk-gold); font-weight: 600;
      }
      .bk-summary-body { padding: 0 1.5rem; }
      .bk-summary-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 0.9rem 0; border-bottom: 1px solid var(--bk-border);
        gap: 1rem;
      }
      .bk-summary-row:last-child { border-bottom: none; }
      .bk-summary-key { font-size: 0.82rem; color: var(--bk-fog); flex-shrink: 0; }
      .bk-summary-val { font-size: 0.9rem; color: var(--bk-cream); font-weight: 500; text-align: right; }
      .bk-summary-val.gold { color: var(--bk-gold); font-family: 'Playfair Display', serif; font-size: 1.1rem; }

      /* ── Buttons ── */
      .bk-btn-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 2rem; }
      .bk-btn {
        display: inline-flex; align-items: center; gap: 0.5rem;
        padding: 0.9rem 1.75rem;
        font-size: 0.78rem; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase;
        border: none; cursor: pointer;
        transition: background 0.2s, transform 0.15s, opacity 0.2s;
        will-change: transform; text-decoration: none;
      }
      .bk-btn:hover:not(:disabled) { transform: translateY(-2px); }
      .bk-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
      .bk-btn-gold  { background: var(--bk-gold); color: var(--bk-black); }
      .bk-btn-gold:hover:not(:disabled) { background: var(--bk-gold-lt); }
      .bk-btn-ghost {
        background: transparent; color: var(--bk-mist);
        border: 1px solid rgba(184,192,208,0.2);
      }
      .bk-btn-ghost:hover:not(:disabled) { border-color: var(--bk-gold); color: var(--bk-gold); }

      /* ── Error / info ── */
      .bk-error {
        background: rgba(231,76,60,0.08); border: 1px solid rgba(231,76,60,0.25);
        color: #ff8a7a; padding: 0.9rem 1.25rem;
        font-size: 0.85rem; margin-bottom: 1.5rem; line-height: 1.6;
      }
      .bk-info {
        background: var(--bk-gold-dim); border-left: 2px solid var(--bk-gold);
        padding: 0.9rem 1.25rem; font-size: 0.82rem;
        color: var(--bk-mist); line-height: 1.65; margin-bottom: 1.5rem;
      }

      /* ── Login wall ── */
      .bk-wall {
        background: var(--bk-gold-dim); border: 1.5px solid var(--bk-gold);
        padding: 3rem 2rem; text-align: center;
        max-width: 560px; margin: 0 auto;
      }
      .bk-wall-icon { font-size: 2.5rem; margin-bottom: 1.25rem; }
      .bk-wall h2 {
        font-family: 'Playfair Display', serif;
        font-size: 1.6rem; color: var(--bk-gold);
        margin-bottom: 1rem; font-weight: 900;
      }
      .bk-wall p { color: var(--bk-mist); line-height: 1.75; margin-bottom: 2rem; font-size: 0.92rem; }
      .bk-wall-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

      /* ── Success screen ── */
      .bk-success-box {
        background: rgba(39,174,96,0.07); border: 1px solid rgba(39,174,96,0.25);
        padding: 2.5rem; text-align: center; max-width: 560px; margin: 0 auto;
      }
      .bk-success-icon { font-size: 3rem; margin-bottom: 1.25rem; }
      .bk-success-box h2 {
        font-family: 'Playfair Display', serif;
        font-size: 1.75rem; color: var(--bk-cream); margin-bottom: 1.25rem;
      }
      .bk-success-box p { color: var(--bk-mist); line-height: 1.8; margin-bottom: 0.5rem; font-size: 0.9rem; }
      .bk-success-box .note { font-size: 0.78rem; color: var(--bk-fog); margin-top: 1rem; margin-bottom: 2rem; }

      /* ── Loading ── */
      .bk-loading {
        text-align: center; padding: 2rem 0;
        color: var(--bk-fog); font-size: 0.88rem;
        display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      }
      .bk-spinner {
        width: 18px; height: 18px; border-radius: 50%;
        border: 2px solid rgba(212,168,67,0.2);
        border-top-color: var(--bk-gold);
        animation: bkSpin 0.7s linear infinite;
      }
      @keyframes bkSpin { to { transform: rotate(360deg); } }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const getMinDate = () => new Date().toISOString().split("T")[0];

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEPS = ["Service", "Barbier", "Date & Heure", "Confirmation"];

const StepBar = ({ current }) => (
  <div className="bk-steps">
    {STEPS.map((label, i) => {
      const n = i + 1;
      const state = n < current ? "done" : n === current ? "active" : "";
      return (
        <React.Fragment key={n}>
          <div className="bk-step-item">
            <div className={`bk-step-dot ${state}`}>
              <div className="bk-step-num">
                {n < current ? "✓" : n}
              </div>
              <span>{label}</span>
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`bk-step-line ${n < current ? "done" : ""}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── BookingPage ──────────────────────────────────────────────────────────────
const BookingPage = () => {
  useBookingStyles();
  const navigate          = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ── Step state ────────────────────────────────────────────────────────────
  const [step,            setStep]            = useState(1);
  const [services,        setServices]        = useState([]);
  const [barbers,         setBarbers]         = useState([]);
  const [availableSlots,  setAvailableSlots]  = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber,  setSelectedBarber]  = useState(null);
  const [selectedDate,    setSelectedDate]    = useState("");
  const [selectedSlot,    setSelectedSlot]    = useState(null);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBarbers,  setLoadingBarbers]  = useState(false);
  const [loadingSlots,    setLoadingSlots]    = useState(false);
  const [loadingConfirm,  setLoadingConfirm]  = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState(false);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      sessionStorage.setItem("redirectAfterLogin", "/reserver");
    }
    fetchServices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch helpers ─────────────────────────────────────────────────────────
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await apiClient.get("/api/booking/services");
      setServices(res.data || []);
    } catch {
      setError("Impossible de charger les services. Veuillez rafraîchir la page.");
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchBarbers = async () => {
    setLoadingBarbers(true);
    setError("");
    try {
      const res = await apiClient.get("/api/booking/barbers");
      setBarbers(res.data || []);
    } catch {
      setError("Impossible de charger les barbiers.");
    } finally {
      setLoadingBarbers(false);
    }
  };

  const fetchSlots = useCallback(async () => {
    if (!selectedService || !selectedBarber || !selectedDate) return;
    setLoadingSlots(true);
    setError("");
    setAvailableSlots([]);
    try {
      const res = await apiClient.get("/api/booking/availability", {
        params: {
          date:      selectedDate,
          barberId:  selectedBarber.id,
          serviceId: selectedService.id,
        },
      });
      setAvailableSlots(res.data || []);
    } catch {
      setError("Impossible de charger les créneaux disponibles.");
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedService, selectedBarber, selectedDate]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  // ── Step handlers ─────────────────────────────────────────────────────────
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedBarber(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setAvailableSlots([]);
    setError("");
    fetchBarbers();
    setStep(2);
  };

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setSelectedDate("");
    setSelectedSlot(null);
    setAvailableSlots([]);
    setError("");
    setStep(3);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setError("");
  };

 const SHOP_HOURS = {
  0: { start: 11, end: 17 }, // Dimanche
  1: { start: 11, end: 19 }, // Lundi
  2: { start: 11, end: 19 }, // Mardi
  3: { start: 11, end: 19 }, // Mercredi
  4: { start: 11, end: 19 }, // Jeudi
  5: { start: 11, end: 19 }, // Vendredi
  6: { start: 12, end: 19 }, // Samedi
};

const isValidSlot = (slot) => {
  const date = new Date(slot);

  const day = date.getDay();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  const hours = SHOP_HOURS[day];

  if (!hours) return false;

  const decimalHour = hour + minutes / 60;

  return (
    decimalHour >= hours.start &&
    decimalHour < hours.end
  );
};

const handleSlotSelect = (slot) => {

  // Vérifie si le slot existe réellement
  if (!availableSlots.includes(slot)) {
    setError("Créneau invalide.");
    return;
  }

  // Vérifie l'horaire du salon
  if (!isValidSlot(slot)) {
    setError("Ce créneau est hors des horaires du salon.");
    return;
  }

  setSelectedSlot(slot);
  setError("");
  setStep(4);
};

  const handleConfirm = async () => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", "/reserver");
      navigate("/login");
      return;
    }
    setLoadingConfirm(true);
    setError("");
    try {
      await apiClient.post("/api/booking/create", {
        serviceId: selectedService.id,
        barberId:  selectedBarber.id,
        startTime: selectedSlot,
      });
      setSuccess(true);
      toast.success("Réservation confirmée !");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Ce créneau vient d'être pris. Veuillez choisir une autre heure.");
        fetchSlots();
        setStep(3);
      } else {
        setError(err.response?.data?.error || "Erreur lors de la réservation. Réessayez.");
      }
      toast.error("Erreur de réservation");
    } finally {
      setLoadingConfirm(false);
    }
  };

  // ── Animation variants ────────────────────────────────────────────────────
  const pageVariants = {
    initial: shouldReduceMotion ? {} : { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit:    shouldReduceMotion ? {} : { opacity: 0, x: -24 },
  };
  const pageTransition = { duration: 0.28, ease: [0.16, 1, 0.3, 1] };

  // ── Login wall ────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="bk-root">
        <section className="bk-sect" style={{ display: "flex", alignItems: "center", minHeight: "80vh" }}>
          <div className="bk-wrap" style={{ width: "100%" }}>
            <div className="bk-wall">
              <div className="bk-wall-icon">🔒</div>
              <h2>Compte requis pour réserver</h2>
              <p>
                La réservation en ligne est réservée aux membres Mr. Renaudin.<br />
                Créez votre compte gratuit en 30 secondes pour accéder aux créneaux.
              </p>
              <div className="bk-wall-btns">
                <button className="bk-btn bk-btn-gold" onClick={() => navigate("/login")}>
                  Créer mon compte
                </button>
                <button className="bk-btn bk-btn-ghost" onClick={() => navigate("/login")}>
                  J'ai déjà un compte
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bk-root">
        <section className="bk-sect" style={{ display: "flex", alignItems: "center", minHeight: "80vh" }}>
          <div className="bk-wrap" style={{ width: "100%" }}>
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bk-success-box">
                <div className="bk-success-icon">✓</div>
                <h2>Réservation confirmée !</h2>
                <p>
                  <strong>{selectedService?.name}</strong> avec <strong>{selectedBarber?.name}</strong>
                </p>
                <p>{fmtDate(selectedSlot)} à {fmtTime(selectedSlot)}</p>
                <p>{ADDRESS}</p>
                <p className="note">
                  Un email de confirmation a été envoyé. Annulation gratuite jusqu'à 24h avant.
                </p>
                <div className="bk-btn-row" style={{ justifyContent: "center" }}>
                  <button className="bk-btn bk-btn-gold" onClick={() => navigate("/mon-espace")}>
                    Voir mes rendez-vous
                  </button>
                  <button className="bk-btn bk-btn-ghost" onClick={() => navigate("/")}>
                    Retour accueil
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // ── Main booking flow ─────────────────────────────────────────────────────
  return (
    <div className="bk-root">
      <section className="bk-sect">
        <div className="bk-wrap">

          {/* Page header */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="bk-eyebrow">Réservation en ligne</p>
            <h1 className="bk-display">Prenez rendez-vous</h1>
            <span className="bk-rule" />
          </motion.div>

          {/* Step bar */}
          <StepBar current={step} />

          {/* Error banner */}
          {error && <div className="bk-error">{error}</div>}

          {/* ── Steps ── */}
          <AnimatePresence mode="wait">

            {/* STEP 1 — Service */}
            {step === 1 && (
              <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <h2 className="bk-section-title">Choisissez votre service</h2>
                {loadingServices ? (
                  <div className="bk-loading"><div className="bk-spinner" /> Chargement des services…</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className={`bk-service-card ${selectedService?.id === svc.id ? "selected" : ""}`}
                        onClick={() => handleServiceSelect(svc)}
                      >
                        <div>
                          <div className="bk-service-name">{svc.name}</div>
                          <div className="bk-service-meta">
                            <span>⏱ {svc.duration} min</span>
                            {svc.description && <span>{svc.description}</span>}
                          </div>
                        </div>
                        <div className="bk-service-price">{svc.price}$</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2 — Barbier */}
            {step === 2 && (
              <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <h2 className="bk-section-title">Choisissez votre barbier</h2>
                {loadingBarbers ? (
                  <div className="bk-loading"><div className="bk-spinner" /> Chargement des barbiers…</div>
                ) : barbers.length === 0 ? (
                  <p style={{ color: "var(--bk-fog)", padding: "2rem 0" }}>Aucun barbier disponible pour le moment.</p>
                ) : (
                  <div className="bk-barbers-grid">
                    {barbers.map((barber) => (
                      <div
                        key={barber.id}
                        className={`bk-barber-card ${selectedBarber?.id === barber.id ? "selected" : ""}`}
                        onClick={() => handleBarberSelect(barber)}
                      >
                        {barber.avatar_url ? (
                          <img
                            src={barber.avatar_url}
                            alt={barber.name}
                            className="bk-barber-avatar"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <div className="bk-barber-initials">{getInitials(barber.name)}</div>
                        )}
                        <div className="bk-barber-name">{barber.name}</div>
                        {barber.specialties && (
                          <div className="bk-barber-spec">
                            {typeof barber.specialties === "string"
                              ? barber.specialties
                              : Array.isArray(barber.specialties)
                              ? barber.specialties.join(" · ")
                              : ""}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="bk-btn-row">
                  <button className="bk-btn bk-btn-ghost" onClick={() => setStep(1)}>← Retour</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Date & Heure */}
            {step === 3 && (
              <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <h2 className="bk-section-title">Choisissez une date et heure</h2>

                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--bk-fog)", marginBottom: "0.6rem" }}>
                  Date
                </label>
                <input
                  type="date"
                  className="bk-date-input"
                  value={selectedDate}
                  min={getMinDate()}
                  onChange={handleDateChange}
                />

                {selectedDate && (
                  <>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--bk-fog)", marginBottom: "0.75rem" }}>
                      Créneaux disponibles
                    </label>

                    {loadingSlots && (
                      <div className="bk-loading"><div className="bk-spinner" /> Chargement des créneaux…</div>
                    )}

                    {!loadingSlots && availableSlots.length === 0 && (
                      <div className="bk-no-slots">
                        Aucun créneau disponible ce jour-là.<br />
                        <span style={{ fontSize: "0.78rem" }}>Essayez une autre date.</span>
                      </div>
                    )}

                    {!loadingSlots && availableSlots.length > 0 && (
                      <div className="bk-slots">
                       {availableSlots
                          .filter(isValidSlot)
                          .map((slot) => (
                          <div
                            key={slot}
                            className={`bk-slot ${selectedSlot === slot ? "selected" : ""}`}
                            onClick={() => handleSlotSelect(slot)}
                          >
                            {fmtTime(slot)}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <div className="bk-btn-row">
                  <button className="bk-btn bk-btn-ghost" onClick={() => setStep(2)}>← Retour</button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Confirmation */}
            {step === 4 && (
              <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <h2 className="bk-section-title">Confirmez votre rendez-vous</h2>

                <div className="bk-info">
                  Vérifiez les détails ci-dessous avant de confirmer. Un email de confirmation vous sera envoyé.
                </div>

                <div className="bk-summary">
                  <div className="bk-summary-header">Récapitulatif</div>
                  <div className="bk-summary-body">
                    {[
                      ["Service",   selectedService?.name],
                      ["Durée",     `${selectedService?.duration} min`],
                      ["Barbier",   selectedBarber?.name],
                      ["Date",      fmtDate(selectedSlot)],
                      ["Heure",     fmtTime(selectedSlot)],
                      ["Adresse",   ADDRESS],
                    ].map(([k, v]) => (
                      <div key={k} className="bk-summary-row">
                        <span className="bk-summary-key">{k}</span>
                        <span className="bk-summary-val">{v}</span>
                      </div>
                    ))}
                    <div className="bk-summary-row">
                      <span className="bk-summary-key">Total</span>
                      <span className="bk-summary-val gold">{selectedService?.price}$ CAD</span>
                    </div>
                  </div>
                </div>

                <div className="bk-btn-row">
                  <button className="bk-btn bk-btn-ghost" onClick={() => setStep(3)}>← Modifier</button>
                  <button
                    className="bk-btn bk-btn-gold"
                    onClick={handleConfirm}
                    disabled={loadingConfirm}
                  >
                    {loadingConfirm
                      ? <><div className="bk-spinner" style={{ width: 14, height: 14 }} /> Confirmation…</>
                      : "Confirmer la réservation →"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
