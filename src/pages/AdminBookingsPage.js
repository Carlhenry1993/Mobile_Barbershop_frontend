import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
// ToastContainer retiré — géré globalement dans App.js
import ChatApp from "../components/ChatApp";

const useAdminStyles = () => {
  useEffect(() => {
    const styleId = "mr-renaudin-admin-dashboard-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
.ad-root {
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
  display: flex;
}

.ad-sidebar {
  width: 260px;
  background: var(--ab-charcoal);
  border-right: 1px solid var(--ab-border);
  padding: 2rem 0;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 100;
  transition: transform 0.3s;
}

.ad-logo {
  padding: 0 1.5rem 2rem;
  border-bottom: 1px solid var(--ab-border);
  margin-bottom: 2rem;
}

.ad-logo-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--ab-gold);
  margin-bottom: 0.25rem;
}

.ad-logo-sub {
  font-size: 0.7rem;
  color: var(--ab-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.ad-nav {
  padding: 0 1rem;
}

.ad-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 8px;
  color: var(--ab-light);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.ad-nav-item:hover {
  background: rgba(212,168,67,0.08);
  color: var(--ab-gold-lt);
}

.ad-nav-item.active {
  background: rgba(212,168,67,0.12);
  color: var(--ab-gold);
  border-color: rgba(212,168,67,0.3);
}

.ad-nav-icon {
  font-size: 1.1rem;
  width: 20px;
}

.ad-content {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  min-height: 100vh;
}

.ad-mobile-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 101;
  background: var(--ab-gold);
  color: var(--ab-black);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 1.5rem;
  cursor: pointer;
}

.ad-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--ab-border);
}

.ad-eyebrow {
  font-size: 0.68rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--ab-gold);
  margin-bottom: 0.5rem;
}

.ad-display {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: var(--ab-cream);
  line-height: 1.1;
}

.ab-gold-rule {
  display: block;
  width: 60px;
  height: 2px;
  background: var(--ab-gold);
  margin: 1rem 0 0;
}

.ab-btn-gold,.ab-btn-outline,.ab-btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
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

.ad-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 99;
}

@media (max-width: 968px) {
.ad-sidebar {
    transform: translateX(-100%);
  }
.ad-sidebar.open {
    transform: translateX(0);
  }
.ad-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 5rem;
  }
.ad-mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
.ad-overlay.show {
    display: block;
  }
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

const AdminDashboard = () => {
  useAdminStyles();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (!token || role !== "admin") {
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

    setStats({
      today: bookingsData.filter(b => b.start_time.startsWith(today) && b.status === 'confirmed').length,
      week:  bookingsData.filter(b => b.start_time >= weekAgo  && b.status === 'confirmed').length,
      month: bookingsData.filter(b => b.start_time >= monthAgo && b.status === 'confirmed').length,
      revenue: bookingsData
        .filter(b => b.start_time >= monthAgo && b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.price || 0), 0),
    });
  };

  const filteredBookings = bookings.filter(b => {
    const matchDate   = !filterDate   || b.start_time.startsWith(filterDate);
    const matchBarber = !filterBarber || b.barber_id.toString() === filterBarber;
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchDate && matchBarber && matchStatus;
  });

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Annuler cette réservation?")) return;
    try {
      await axios.patch(`/api/booking/admin/${id}/cancel`);
      toast.success("Réservation annulée");
      fetchInitialData();
    } catch {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const handleCompleteBooking = async (id) => {
    try {
      await axios.patch(`/api/booking/admin/${id}/complete`);
      toast.success("Réservation marquée comme terminée");
      fetchInitialData();
    } catch {
      toast.error("Erreur");
    }
  };

  const handleEditBooking   = (booking) => { setEditingBooking(booking); setShowModal(true); };

  const handleSaveBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/booking/admin/${editingBooking.id}`, editingBooking);
      toast.success("Réservation mise à jour");
      setShowModal(false);
      setEditingBooking(null);
      fetchInitialData();
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const menuItems = [
    { id: "bookings", label: "Réservations", icon: "📅" },
    { id: "clients",  label: "Clients",       icon: "👥" },
    { id: "barbers",  label: "Barbiers",       icon: "✂️" },
    { id: "services", label: "Services",       icon: "💈" },
    { id: "stats",    label: "Statistiques",   icon: "📊" },
    { id: "chat",     label: "Chat Live",      icon: "💬" },
    { id: "settings", label: "Paramètres",     icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return (
          <>
            <div className="ad-header">
              <p className="ad-eyebrow">Administration</p>
              <h1 className="ad-display">Gestion des Réservations</h1>
              <span className="ab-gold-rule" />
            </div>

            <div className="ab-stats">
              <div className="ab-stat-card"><div className="ab-stat-label">Aujourd'hui</div><div className="ab-stat-value">{stats.today}</div></div>
              <div className="ab-stat-card"><div className="ab-stat-label">Cette semaine</div><div className="ab-stat-value">{stats.week}</div></div>
              <div className="ab-stat-card"><div className="ab-stat-label">Ce mois</div><div className="ab-stat-value">{stats.month}</div></div>
              <div className="ab-stat-card"><div className="ab-stat-label">Revenus (mois)</div><div className="ab-stat-value">{stats.revenue.toFixed(0)}$</div></div>
            </div>

            <div className="ab-filters">
              <div>
                <label className="ab-label">Date</label>
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="ab-input" />
              </div>
              <div>
                <label className="ab-label">Barbier</label>
                <select value={filterBarber} onChange={(e) => setFilterBarber(e.target.value)} className="ab-select">
                  <option value="">Tous</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="ab-label">Statut</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="ab-select">
                  <option value="">Tous</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                  <option value="completed">Terminé</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button onClick={() => { setFilterDate(""); setFilterBarber(""); setFilterStatus(""); }} className="ab-btn-outline" style={{ width: "100%" }}>
                  Réinitialiser
                </button>
              </div>
            </div>

            {error && <div className="ab-error">{error}</div>}

            {loading ? (
              <p style={{ textAlign: "center", padding: "4rem", color: "var(--ab-muted)" }}>Chargement...</p>
            ) : filteredBookings.length === 0 ? (
              <div className="ab-empty">Aucune réservation trouvée</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="ab-table">
                  <thead>
                    <tr>
                      <th>Date & Heure</th><th>Client</th><th>Service</th>
                      <th>Barbier</th><th>Prix</th><th>Statut</th><th>Actions</th>
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
                            {b.status === 'confirmed' ? 'Confirmé' : b.status === 'cancelled' ? 'Annulé' : 'Terminé'}
                          </span>
                        </td>
                        <td>
                          <div className="ab-actions">
                            {b.status === 'confirmed' && (
                              <>
                                <button onClick={() => handleCompleteBooking(b.id)} className="ab-icon-btn" title="Marquer terminé">✓</button>
                                <button onClick={() => handleEditBooking(b)} className="ab-icon-btn" title="Modifier">✎</button>
                                <button onClick={() => handleCancelBooking(b.id)} className="ab-icon-btn danger" title="Annuler">✕</button>
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

      case "chat":
        return (
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
        return (<><div className="ad-header"><p className="ad-eyebrow">Gestion</p><h1 className="ad-display">Clients</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Clients en développement...</p></>);
      case "barbers":
        return (<><div className="ad-header"><p className="ad-eyebrow">Équipe</p><h1 className="ad-display">Barbiers</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Barbiers en développement...</p></>);
      case "services":
        return (<><div className="ad-header"><p className="ad-eyebrow">Catalogue</p><h1 className="ad-display">Services</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Services en développement...</p></>);
      case "stats":
        return (<><div className="ad-header"><p className="ad-eyebrow">Analytics</p><h1 className="ad-display">Statistiques</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Statistiques en développement...</p></>);
      case "settings":
        return (<><div className="ad-header"><p className="ad-eyebrow">Configuration</p><h1 className="ad-display">Paramètres</h1><span className="ab-gold-rule" /></div><p style={{ color: "var(--ab-muted)", padding: "2rem 0" }}>Module Paramètres en développement...</p></>);
      default:
        return null;
    }
  };

  return (
    <div className="ad-root">
      <button className="ad-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>

      <div className={`ad-overlay ${mobileMenuOpen ? 'show' : ''}`} onClick={() => setMobileMenuOpen(false)} />

      <aside className={`ad-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="ad-logo">
          <div className="ad-logo-title">Mr. Renaudin</div>
          <div className="ad-logo-sub">Admin Panel</div>
        </div>
        <nav className="ad-nav">
          {menuItems.map((item) => (
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

      <main className="ad-content">
        {renderContent()}
      </main>

      <AnimatePresence>
        {showModal && editingBooking && (
          <motion.div
            className="ab-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="ab-modal"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Modifier la réservation</h3>
              <form onSubmit={handleSaveBooking}>
                <div className="ab-form-group">
                  <label className="ab-label">Service</label>
                  <select value={editingBooking.service_id} onChange={(e) => setEditingBooking({...editingBooking, service_id: e.target.value})} className="ab-select">
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="ab-form-group">
                  <label className="ab-label">Barbier</label>
                  <select value={editingBooking.barber_id} onChange={(e) => setEditingBooking({...editingBooking, barber_id: e.target.value})} className="ab-select">
                    {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="ab-form-group">
                  <label className="ab-label">Date & Heure</label>
                  <input type="datetime-local" value={editingBooking.start_time.slice(0, 16)} onChange={(e) => setEditingBooking({...editingBooking, start_time: e.target.value})} className="ab-input" />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  <button type="button" onClick={() => setShowModal(false)} className="ab-btn-outline" style={{ flex: 1 }}>Annuler</button>
                  <button type="submit" className="ab-btn-gold" style={{ flex: 1 }}>Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
