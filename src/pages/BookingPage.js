import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast } from "react-toastify";
// ToastContainer retiré — géré globalement dans App.js

const ADDRESS = "462 4e Rue de la Pointe, Shawinigan, QC G9N 1G7";

const useBookingStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-booking-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
  .bk-root {
        --bk-black: #0e1015;
        --bk-charcoal: #161b24;
        --bk-card: #1e2535;
        --bk-border: #2a3348;
        --bk-gold: #d4a843;
        --bk-gold-lt: #f0c96a;
        --bk-gold-dim: rgba(212,168,67,0.13);
        --bk-steel: #8ba8c8;
        --bk-cream: #eef2f7;
        --bk-light: #b8c8da;
        --bk-muted: #7888a0;
        --bk-danger: #e74c3c;
        --bk-success: #27ae60;
        background: var(--bk-black);
        color: var(--bk-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100svh;
      }
  .bk-inner { position: relative; z-index: 1; }
  .bk-section-pad { padding: 6rem 1.5rem; }
      @media (max-width: 768px) {
  .bk-section-pad { padding: 4rem 1.25rem; }
      }
  .bk-eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--bk-gold);
        margin-bottom: 1rem;
      }
  .bk-display {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        line-height: 1.05;
        color: var(--bk-cream);
      }
  .bk-gold-rule {
        display: block;
        width: 60px;
        height: 2px;
        background: var(--bk-gold);
        margin: 0 auto 1.5rem;
      }
  .bk-btn-gold, .bk-btn-outline {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 0.85rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 1rem 2rem;
        border: none;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s, border-color 0.3s, color 0.3s;
        text-decoration: none;
        will-change: transform;
      }
  .bk-btn-gold {
        background: var(--bk-gold);
        color: var(--bk-black);
      }
  .bk-btn-gold:hover, .bk-btn-gold:focus-visible { 
        background: var(--bk-gold-lt); 
        transform: translateY(-2px);
        outline: 2px solid var(--bk-gold-lt);
        outline-offset: 2px;
      }
  .bk-btn-gold:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
  .bk-btn-outline {
        background: transparent;
        color: var(--bk-cream);
        border: 1px solid rgba(184,200,218,0.3);
      }
  .bk-btn-outline:hover, .bk-btn-outline:focus-visible { 
        border-color: var(--bk-gold); 
        color: var(--bk-gold); 
        transform: translateY(-2px);
        outline: 2px solid var(--bk-gold);
        outline-offset: 2px;
      }
  .bk-card {
        background: var(--bk-card);
        border: 1px solid var(--bk-border);
        padding: 2rem;
        transition: border-color 0.3s, transform 0.3s;
        cursor: pointer;
        will-change: transform;
      }
  .bk-card:hover { 
        border-color: var(--bk-gold); 
        transform: translateY(-4px);
      }
  .bk-card.selected {
        border-color: var(--bk-gold);
        background: rgba(212,168,67,0.08);
      }
  .bk-steps {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
      }
  .bk-step {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: var(--bk-muted);
        letter-spacing: 0.05em;
      }
  .bk-step.active { color: var(--bk-gold); }
  .bk-step.done { color: var(--bk-success); }
  .bk-step-num {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid currentColor;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.75rem;
      }
  .bk-step.active .bk-step-num {
        background: var(--bk-gold);
        color: var(--bk-black);
        border-color: var(--bk-gold);
      }
  .bk-slot {
        background: var(--bk-card);
        border: 1px solid var(--bk-border);
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
        font-size: 0.9rem;
      }
  .bk-slot:hover { border-color: var(--bk-gold); }
  .bk-slot.selected {
        background: var(--bk-gold);
        color: var(--bk-black);
        border-color: var(--bk-gold);
        font-weight: 600;
      }
  .bk-input {
        width: 100%;
        background: var(--bk-black);
        border: 1px solid var(--bk-border);
        color: var(--bk-cream);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.95rem;
        padding: 1rem 1.25rem;
        transition: border-color 0.3s;
      }
  .bk-input:focus {
        outline: none;
        border-color: var(--bk-gold);
      }
  .bk-error {
        background: rgba(231,76,60,0.1);
        border: 1px solid rgba(231,76,60,0.3);
        color: #ff8a7a;
        padding: 1rem;
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
      }
  .bk-success {
        background: rgba(39,174,96,0.1);
        border: 1px solid rgba(39,174,96,0.3);
        color: #7dd87d;
        padding: 2rem;
        text-align: center;
      }
  .bk-login-wall {
        background: rgba(212,168,67,0.1);
        border: 2px solid var(--bk-gold);
        padding: 3rem 2rem;
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
      }
  .bk-login-wall h2 {
        font-family: 'Playfair Display', serif;
        font-size: 1.75rem;
        color: var(--bk-gold);
        margin-bottom: 1rem;
      }
  .bk-login-wall p {
        color: var(--bk-light);
        line-height: 1.7;
        margin-bottom: 2rem;
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);
};

const BookingPage = () => {
  useBookingStyles();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  axios.defaults.baseURL = "https://mobile-barbershop-backend.onrender.com";

  const fetchAvailability = useCallback(async () => {
    if (!selectedService || !selectedBarber || !selectedDate) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/booking/availability", {
        params: { date: selectedDate, barberId: selectedBarber.id, serviceId: selectedService.id },
      });
      setAvailableSlots(res.data || []);
    } catch {
      setError("Impossible de charger les créneaux");
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [selectedService, selectedBarber, selectedDate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      sessionStorage.setItem('redirectAfterLogin', '/reserver');
    }
    fetchServices();
  }, []);

  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  const fetchServices = async () => {
    try {
      const res = await axios.get("/api/booking/services");
      setServices(res.data || []);
    } catch {
      setError("Impossible de charger les services");
      setServices([]);
    }
  };

  const fetchBarbers = async () => {
    setLoadingBarbers(true);
    setError("");
    try {
      const res = await axios.get("/api/booking/barbers");
      setBarbers(res.data || []);
    } catch {
      setError("Impossible de charger les barbiers");
      setBarbers([]);
    } finally {
      setLoadingBarbers(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedBarber(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setAvailableSlots([]);
    fetchBarbers();
    setStep(2);
  };

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setSelectedDate("");
    setSelectedSlot(null);
    setAvailableSlots([]);
    setStep(3);
  };

  const handleDateChange  = (e) => { setSelectedDate(e.target.value); setSelectedSlot(null); };
  const handleSlotSelect  = (slot) => { setSelectedSlot(slot); setStep(4); };

  const handleConfirmBooking = async () => {
    if (!isLoggedIn) { sessionStorage.setItem('redirectAfterLogin', '/reserver'); navigate('/login'); return; }
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/booking/create", {
        serviceId: selectedService.id,
        barberId:  selectedBarber.id,
        startTime: selectedSlot,
      });
      setSuccess(true);
      toast.success("Réservation confirmée!");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Ce créneau vient d'être réservé. Choisissez-en un autre.");
        fetchAvailability();
        setStep(3);
      } else {
        setError(err.response?.data?.error || "Erreur lors de la réservation");
      }
      toast.error("Erreur de réservation");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const getMinDate = () => new Date().toISOString().split("T")[0];

  if (!isLoggedIn) {
    return (
      <div className="bk-root">
        <div className="bk-inner">
          <section className="bk-section-pad" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div className="bk-login-wall">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
                <h2>Compte requis pour réserver</h2>
                <p>La réservation en ligne est réservée aux membres Mr. Renaudin.<br />Créez votre compte gratuit en 30 secondes.</p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => navigate("/login")} className="bk-btn-gold">Créer mon compte</button>
                  <button onClick={() => navigate("/login")} className="bk-btn-outline">J'ai déjà un compte</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bk-root">
        <div className="bk-inner">
          <section className="bk-section-pad" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div className="bk-success">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
                <h2 className="bk-display" style={{ fontSize: "2rem", marginBottom: "1rem" }}>Réservation confirmée!</h2>
                <p style={{ color: "var(--bk-light)", lineHeight: "1.7", marginBottom: "2rem" }}>
                  <strong>{selectedService?.name}</strong> avec <strong>{selectedBarber?.name}</strong><br />
                  {formatDate(selectedSlot)} à {formatTime(selectedSlot)}<br />
                  {ADDRESS}
                </p>
                <p style={{ color: "var(--bk-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
                  Un email de confirmation vous a été envoyé. Annulation gratuite jusqu'à 24h avant.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => navigate("/compte")} className="bk-btn-gold">Mes réservations</button>
                  <button onClick={() => navigate("/")} className="bk-btn-outline">Retour accueil</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bk-root">
      <div className="bk-inner">
        <section className="bk-section-pad">
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="bk-eyebrow">Réservation en ligne</p>
              <span className="bk-gold-rule" />
              <h1 className="bk-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>Prenez rendez-vous</h1>
            </div>

            <div className="bk-steps">
              {[
                { n: 1, label: "Service" },
                { n: 2, label: "Barbier" },
                { n: 3, label: "Date & Heure" },
                { n: 4, label: "Confirmation" },
              ].map(({ n, label }) => (
                <div key={n} className={`bk-step ${step >= n ? "active" : ""} ${step > n ? "done" : ""}`}>
                  <div className="bk-step-num">{step > n ? "✓" : n}</div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {error && <div className="bk-error">{error}</div>}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 style={{ color: "var(--bk-cream)", fontSize: "1.3rem", marginBottom: "1.5rem", fontFamily: "'Playfair Display', serif" }}>Choisissez votre service</h2>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {services.map((service) => (
                      <div key={service.id} className="bk-card" onClick={() => handleServiceSelect(service)}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <div>
                            <h3 style={{ color: "var(--bk-cream)", fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: 600 }}>{service.name}</h3>
                            <p style={{ color: "var(--bk-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{service.duration} min</p>
                            {service.description && <p style={{ color: "var(--bk-light)", fontSize: "0.85rem", lineHeight: "1.6" }}>{service.description}</p>}
                          </div>
                          <div style={{ color: "var(--bk-gold)", fontSize: "1.2rem", fontWeight: 700 }}>{service.price}$</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 style={{ color: "var(--bk-cream)", fontSize: "1.3rem", marginBottom: "1.5rem", fontFamily: "'Playfair Display', serif" }}>Choisissez votre barbier</h2>
                  {loadingBarbers && <p style={{ color: "var(--bk-muted)", textAlign: "center" }}>Chargement des barbiers...</p>}
                  {!loadingBarbers && barbers.length === 0 && <p style={{ color: "var(--bk-muted)", textAlign: "center", padding: "2rem" }}>Aucun barbier disponible.</p>}
                  {!loadingBarbers && barbers.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                      {barbers.map((barber) => (
                        <div key={barber.id} className="bk-card" onClick={() => handleBarberSelect(barber)}>
                          {barber.avatar_url && <img src={barber.avatar_url} alt={barber.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", marginBottom: "1rem" }} onError={(e) => { e.target.style.display = 'none'; }} />}
                          <h3 style={{ color: "var(--bk-cream)", fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: 600 }}>{barber.name}</h3>
                          {barber.specialties && <p style={{ color: "var(--bk-muted)", fontSize: "0.8rem" }}>{typeof barber.specialties === 'string' ? barber.specialties : Array.isArray(barber.specialties) ? barber.specialties.join(" • ") : ""}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setStep(1)} className="bk-btn-outline" style={{ marginTop: "2rem" }}>← Retour</button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 style={{ color: "var(--bk-cream)", fontSize: "1.3rem", marginBottom: "1.5rem", fontFamily: "'Playfair Display', serif" }}>Choisissez une date et heure</h2>
                  <div style={{ marginBottom: "2rem" }}>
                    <label style={{ color: "var(--bk-light)", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>Date</label>
                    <input type="date" value={selectedDate} onChange={handleDateChange} min={getMinDate()} className="bk-input" />
                  </div>
                  {loading && <p style={{ color: "var(--bk-muted)" }}>Chargement des créneaux...</p>}
                  {selectedDate && availableSlots.length === 0 && !loading && <p style={{ color: "var(--bk-muted)", textAlign: "center", padding: "2rem" }}>Aucun créneau disponible ce jour-là</p>}
                  {availableSlots.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem" }}>
                      {availableSlots.map((slot) => (
                        <div key={slot} className={`bk-slot ${selectedSlot === slot ? "selected" : ""}`} onClick={() => handleSlotSelect(slot)}>
                          {formatTime(slot)}
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setStep(2)} className="bk-btn-outline" style={{ marginTop: "2rem" }}>← Retour</button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 style={{ color: "var(--bk-cream)", fontSize: "1.3rem", marginBottom: "1.5rem", fontFamily: "'Playfair Display', serif" }}>Confirmer votre réservation</h2>
                  <div style={{ background: "var(--bk-card)", border: "1px solid var(--bk-border)", padding: "2rem", marginBottom: "2rem" }}>
                    <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--bk-border)" }}>
                      <p style={{ color: "var(--bk-muted)", fontSize: "0.8rem", marginBottom: "0.25rem" }}>Service</p>
                      <p style={{ color: "var(--bk-cream)", fontSize: "1.1rem", fontWeight: 600 }}>{selectedService?.name}</p>
                      <p style={{ color: "var(--bk-muted)", fontSize: "0.85rem" }}>{selectedService?.duration} min • {selectedService?.price}$</p>
                    </div>
                    <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--bk-border)" }}>
                      <p style={{ color: "var(--bk-muted)", fontSize: "0.8rem", marginBottom: "0.25rem" }}>Barbier</p>
                      <p style={{ color: "var(--bk-cream)", fontSize: "1.1rem", fontWeight: 600 }}>{selectedBarber?.name}</p>
                    </div>
                    <div>
                      <p style={{ color: "var(--bk-muted)", fontSize: "0.8rem", marginBottom: "0.25rem" }}>Date & Heure</p>
                      <p style={{ color: "var(--bk-cream)", fontSize: "1.1rem", fontWeight: 600 }}>
                        {selectedSlot && formatDate(selectedSlot)} à {selectedSlot && formatTime(selectedSlot)}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button onClick={() => setStep(3)} className="bk-btn-outline">← Modifier</button>
                    <button onClick={handleConfirmBooking} className="bk-btn-gold" disabled={loading}>
                      {loading ? "Confirmation..." : "Confirmer la réservation"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingPage;
