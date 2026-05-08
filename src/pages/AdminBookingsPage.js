import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useAdminBookingStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-admin-booking-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
.ab-root {
        --ab-black: #0e1015;
        --ab-charcoal: #161b24;
        --ab-card: #1e2535;
        --ab-border: #2a3348;
        --ab-gold: #d4a843;
        --ab-gold-lt: #f0c96a;
        --ab-steel: #8ba8c8;
        --ab-cream: #eef2f7;
        --ab-light: #b8c8da;
        --ab-muted: #7888a0;
        --ab-danger: #e74c3c;
        --ab-success: #27ae60;
        --ab-warning: #f39c12;

        background: var(--ab-black);
        color: var(--ab-cream);
        font-family: 'DM Sans', sans-serif;
        -webkit-font-smoothing: antialiased;
        min-height: 100svh;
      }

.ab-inner { position: relative; z-index: 1; }

.ab-section-pad { padding: 4rem 1.5rem; }
      @media (max-width: 768px) {
.ab-section-pad { padding: 3rem 1.25rem; }
      }

.ab-eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--ab-gold);
        margin-bottom: 1rem;
      }

.ab-display {
        font-family: 'Playfair Display', Georgia, serif;
        font-weight: 900;
        line-height: 1.05;
        color: var(--ab-cream);
      }

.ab-gold-rule {
        display: block;
        width: 60px;
        height: 2px;
        background: var(--ab-gold);
        margin: 0 auto 1.5rem;
      }

.ab-btn-gold,.ab-btn-outline,.ab-btn-danger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 0.8rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.75rem 1.5rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }
.ab-btn-gold {
        background: var(--ab-gold);
        color: var(--ab-black);
      }
.ab-btn-gold:hover { background: var(--ab-gold-lt); }
.ab-btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
.ab-btn-outline {
        background: transparent;
        color: var(--ab-cream);
        border: 1px solid var(--ab-border);
      }
.ab-btn-outline:hover { border-color: var(--ab-gold); color: var(--ab-gold); }
.ab-btn-danger {
        background: var(--ab-danger);
        color: #fff;
      }
.ab-btn-danger:hover { background: #c0392b; }

.ab-filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--ab-card);
        border: 1px solid var(--ab-border);
      }

.ab-input,.ab-select {
        width: 100%;
        background: var(--ab-black);
        border: 1px solid var(--ab-border);
        color: var(--ab-cream);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.9rem;
        padding: 0.75rem 1rem;
        transition: border-color 0.3s;
      }
.ab-input:focus,.ab-select:focus {
        outline: none;
        border-color: var(--ab-gold);
      }

.ab-label {
        color: var(--ab-light);
        font-size: 0.8rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        display: block;
      }

.ab-table {
        width: 100%;
        background: var(--ab-card);
        border: 1px solid var(--ab-border);
        border-collapse: collapse;
      }

.ab-table th {
        background: var(--ab-charcoal);
        color: var(--ab-gold);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--ab-border);
      }

.ab-table td {
        padding: 1rem;
        border-bottom: 1px solid var(--ab-border);
        font-size: 0.9rem;
        color: var(--ab-light);
      }

.ab-table tr:hover {
        background: rgba(212,168,67,0.05);
      }

.ab-status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
      }
.ab-status.confirmed {
        background: rgba(39,174,96,0.15);
        color: var(--ab-success);
        border: 1px solid rgba(39,174,96,0.3);
      }
.ab-status.cancelled {
        background: rgba(231,76,60,0.15);
        color: var(--ab-danger);
        border: 1px solid rgba(231,76,60,0.3);
      }
.ab-status.completed {
        background: rgba(139,168,200,0.15);
        color: var(--ab-steel);
        border: 1px solid rgba(139,168,200,0.3);
      }

.ab-actions {
        display: flex;
        gap: 0.5rem;
      }

.ab-icon-btn {
        background: transparent;
        border: 1px solid var(--ab-border);
        color: var(--ab-muted);
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.85rem;
      }
.ab-icon-btn:hover {
        border-color: var(--ab-gold);
        color: var(--ab-gold);
      }
.ab-icon-btn.danger:hover {
        border-color: var(--ab-danger);
        color: var(--ab-danger);
      }

.ab-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.8);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

.ab-modal {
        background: var(--ab-card);
        border: 1px solid var(--ab-border);
        padding: 2rem;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      }

.ab-modal h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        color: var(--ab-cream);
        margin-bottom: 1.5rem;
      }

.ab-form-group {
        margin-bottom: 1.25rem;
      }

.ab-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

.ab-stat-card {
        background: var(--ab-card);
        border: 1px solid var(--ab-border);
        padding: 1.5rem;
      }

.ab-stat-label {
        color: var(--ab-muted);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.5rem;
      }

.ab-stat-value {
        color: var(--ab-cream);
        font-size: 2rem;
        font-weight: 700;
        font-family: 'Playfair Display', serif;
      }

.ab-empty {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--ab-muted);
      }

.ab-error {
        background: rgba(231,76,60,0.1);
        border: 1px solid rgba(231,76,60,0.3);
        color: #ff8a7a;
        padding: 1rem;
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
      }

      @media (max-width: 768px) {
      .ab-table { font-size: 0.8rem; }
      .ab-table th,.ab-table td { padding: 0.75rem 0.5rem; }
      .ab-actions { flex-direction: column; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);
};

const AdminBookingsPage = () => {
  useAdminBookingStyles();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterBarber, setFilterBarber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, revenue: 0 });

  axios.defaults.baseURL = "https://mobile-barbershop-backend.onrender.com";

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes, barbersRes] = await Promise.all([
        axios.get("/api/booking/admin/all"),
        axios.get("/api/booking/services"),
        axios.get("/api/booking/barbers")
      ]);
      setBookings(bookingsRes.data);
      setServices(servicesRes.data);
      setBarbers(barbersRes.data);
      calculateStats(bookingsRes.data);
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
    if (!token || role!== "admin") {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchInitialData();
  }, [navigate, fetchInitialData]);

  const calculateStats = (bookingsData) => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const todayBookings = bookingsData.filter(b =>
      b.start_time.startsWith(today) && b.status === 'confirmed'
    ).length;

    const weekBookings = bookingsData.filter(b =>
      b.start_time >= weekAgo && b.status === 'confirmed'
    ).length;

    const monthBookings = bookingsData.filter(b =>
      b.start_time >= monthAgo && b.status === 'confirmed'
    ).length;

    const revenue = bookingsData
    .filter(b => b.start_time >= monthAgo && b.status === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.price || 0), 0);

    setStats({ today: todayBookings, week: weekBookings, month: monthBookings, revenue });
  };

  const filteredBookings = bookings.filter(b => {
    const matchDate =!filterDate || b.start_time.startsWith(filterDate);
    const matchBarber =!filterBarber || b.barber_id.toString() === filterBarber;
    const matchStatus =!filterStatus || b.status === filterStatus;
    return matchDate && matchBarber && matchStatus;
  });

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Annuler cette réservation?")) return;

    try {
      await axios.patch(`/api/booking/admin/${id}/cancel`);
      toast.success("Réservation annulée");
      fetchInitialData();
    } catch (err) {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const handleCompleteBooking = async (id) => {
    try {
      await axios.patch(`/api/booking/admin/${id}/complete`);
      toast.success("Réservation marquée comme terminée");
      fetchInitialData();
    } catch (err) {
      toast.error("Erreur");
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleSaveBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/booking/admin/${editingBooking.id}`, editingBooking);
      toast.success("Réservation mise à jour");
      setShowModal(false);
      setEditingBooking(null);
      fetchInitialData();
    } catch (err) {
      toast.error("Erreur de mise à jour");
    }
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="ab-root">
      <div className="ab-inner">
        <section className="ab-section-pad">
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="ab-eyebrow">Administration</p>
              <span className="ab-gold-rule" />
              <h1 className="ab-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                Gestion des Réservations
              </h1>
            </div>

            <div className="ab-stats">
              <div className="ab-stat-card">
                <div className="ab-stat-label">Aujourd'hui</div>
                <div className="ab-stat-value">{stats.today}</div>
              </div>
              <div className="ab-stat-card">
                <div className="ab-stat-label">Cette semaine</div>
                <div className="ab-stat-value">{stats.week}</div>
              </div>
              <div className="ab-stat-card">
                <div className="ab-stat-label">Ce mois</div>
                <div className="ab-stat-value">{stats.month}</div>
              </div>
              <div className="ab-stat-card">
                <div className="ab-stat-label">Revenus (mois)</div>
                <div className="ab-stat-value">{stats.revenue.toFixed(0)}$</div>
              </div>
            </div>

            <div className="ab-filters">
              <div>
                <label className="ab-label">Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="ab-input"
                />
              </div>
              <div>
                <label className="ab-label">Barbier</label>
                <select
                  value={filterBarber}
                  onChange={(e) => setFilterBarber(e.target.value)}
                  className="ab-select"
                >
                  <option value="">Tous</option>
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ab-label">Statut</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="ab-select"
                >
                  <option value="">Tous</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={() => {
                    setFilterDate("");
                    setFilterBarber("");
                    setFilterStatus("");
                  }}
                  className="ab-btn-outline"
                  style={{ width: "100%" }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            {error && <div className="ab-error">{error}</div>}

            {loading? (
              <p style={{ textAlign: "center", padding: "4rem", color: "var(--ab-muted)" }}>
                Chargement...
              </p>
            ) : filteredBookings.length === 0? (
              <div className="ab-empty">
                Aucune réservation trouvée
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="ab-table">
                  <thead>
                    <tr>
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
                    {filteredBookings.map((b) => (
                      <tr key={b.id}>
                        <td>{formatDateTime(b.start_time)}</td>
                        <td>{b.client_name}</td>
                        <td>{b.service_name}</td>
                        <td>{b.barber_name}</td>
                        <td>{b.price}$</td>
                        <td>
                          <span className={`ab-status ${b.status}`}>
                            {b.status === 'confirmed'? 'Confirmé' :
                             b.status === 'cancelled'? 'Annulé' : 'Terminé'}
                          </span>
                        </td>
                        <td>
                          <div className="ab-actions">
                            {b.status === 'confirmed' && (
                              <>
                                <button
                                  onClick={() => handleCompleteBooking(b.id)}
                                  className="ab-icon-btn"
                                  title="Marquer terminé"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => handleEditBooking(b)}
                                  className="ab-icon-btn"
                                  title="Modifier"
                                >
                                  ✎
                                </button>
                                <button
                                  onClick={() => handleCancelBooking(b.id)}
                                  className="ab-icon-btn danger"
                                  title="Annuler"
                                >
                                  ✕
                                </button>
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
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showModal && editingBooking && (
          <motion.div
            className="ab-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="ab-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Modifier la réservation</h3>
              <form onSubmit={handleSaveBooking}>
                <div className="ab-form-group">
                  <label className="ab-label">Service</label>
                  <select
                    value={editingBooking.service_id}
                    onChange={(e) => setEditingBooking({...editingBooking, service_id: e.target.value})}
                    className="ab-select"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ab-form-group">
                  <label className="ab-label">Barbier</label>
                  <select
                    value={editingBooking.barber_id}
                    onChange={(e) => setEditingBooking({...editingBooking, barber_id: e.target.value})}
                    className="ab-select"
                  >
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="ab-form-group">
                  <label className="ab-label">Date & Heure</label>
                  <input
                    type="datetime-local"
                    value={editingBooking.start_time.slice(0, 16)}
                    onChange={(e) => setEditingBooking({...editingBooking, start_time: e.target.value})}
                    className="ab-input"
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  <button type="button" onClick={() => setShowModal(false)} className="ab-btn-outline" style={{ flex: 1 }}>
                    Annuler
                  </button>
                  <button type="submit" className="ab-btn-gold" style={{ flex: 1 }}>
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer theme="dark" position="top-center" />
    </div>
  );
};

export default AdminBookingsPage;