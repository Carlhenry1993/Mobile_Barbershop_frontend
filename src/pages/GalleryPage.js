import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import apiClient from "../lib/apiClient";

const useGalleryStyles = () => {
  useEffect(() => {
    const id = "mrr-gallery-page-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      .ga-root {
        --ga-bg: #0c0f13; --ga-panel: #151a20; --ga-ink: #f5f1e8;
        --ga-muted: #a8b0ba; --ga-line: rgba(245,241,232,0.12); --ga-gold: #d6aa4b;
        background: var(--ga-bg); color: var(--ga-ink); min-height: 100vh;
        font-family: 'DM Sans', Arial, sans-serif;
      }
      .ga-shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
      .ga-hero { padding: 6rem 0 3rem; border-bottom: 1px solid var(--ga-line); }
      .ga-eyebrow { color: var(--ga-gold); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
      .ga-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.7rem, 7vw, 6.2rem); line-height: 0.98; margin: 0.8rem 0 1rem; }
      .ga-copy { color: var(--ga-muted); line-height: 1.75; max-width: 680px; }
      .ga-toolbar { display: flex; flex-wrap: wrap; gap: 0.6rem; padding: 2rem 0; }
      .ga-filter { border: 1px solid var(--ga-line); background: var(--ga-panel); color: var(--ga-ink); padding: 0.65rem 0.9rem; cursor: pointer; font-weight: 800; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; }
      .ga-filter.active { background: var(--ga-gold); color: #111; border-color: var(--ga-gold); }
      .ga-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding-bottom: 5rem; }
      .ga-card { position: relative; overflow: hidden; border: 1px solid var(--ga-line); background: var(--ga-panel); min-height: 280px; }
      .ga-card:nth-child(4n + 1) { grid-row: span 2; }
      .ga-card img { width: 100%; height: 100%; min-height: 280px; object-fit: cover; display: block; transition: transform .45s ease; }
      .ga-card:hover img { transform: scale(1.04); }
      .ga-info { position: absolute; inset: auto 0 0; padding: 1rem; background: linear-gradient(0deg, rgba(12,15,19,0.92), transparent); }
      .ga-info h2 { margin: 0; font-size: 1rem; }
      .ga-info p { margin: 0.35rem 0 0; color: rgba(245,241,232,0.76); font-size: 0.84rem; line-height: 1.55; }
      .ga-empty { background: var(--ga-panel); border: 1px solid var(--ga-line); padding: 3rem; text-align: center; color: var(--ga-muted); margin-bottom: 5rem; }
      @media (max-width: 900px) { .ga-grid { grid-template-columns: repeat(2, 1fr); } .ga-card:nth-child(4n + 1) { grid-row: span 1; } }
      @media (max-width: 580px) { .ga-grid { grid-template-columns: 1fr; } .ga-card, .ga-card img { min-height: 320px; } }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);
};

const GalleryPage = () => {
  useGalleryStyles();
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("tout");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/gallery")
      .then(res => setPhotos(res.data || []))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(photos.map(photo => photo.category).filter(Boolean)));
    return ["tout", ...unique];
  }, [photos]);

  const displayed = activeCategory === "tout"
    ? photos
    : photos.filter(photo => photo.category === activeCategory);

  return (
    <main className="ga-root">
      <Helmet>
        <title>Galerie | Mr. Renaudin Barbershop</title>
        <meta name="description" content="Galerie dynamique des coupes et photos publiees par Mr. Renaudin Barbershop." />
      </Helmet>

      <section className="ga-hero">
        <div className="ga-shell">
          <p className="ga-eyebrow">Galerie officielle</p>
          <h1 className="ga-title">Les photos publiees par le salon.</h1>
          <p className="ga-copy">
            Les images de cette page sont gerees par le proprietaire du barbershop.
            Elles peuvent etre ajoutees, mises en avant ou retirees depuis le dashboard admin.
          </p>
        </div>
      </section>

      <section className="ga-shell">
        <div className="ga-toolbar" aria-label="Filtrer la galerie">
          {categories.map(category => (
            <button
              key={category}
              className={`ga-filter ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="ga-empty">Chargement de la galerie...</div>
        ) : displayed.length === 0 ? (
          <div className="ga-empty">
            Aucune photo publiee pour le moment. Le proprietaire peut en ajouter depuis le dashboard.
          </div>
        ) : (
          <div className="ga-grid">
            {displayed.map(photo => (
              <article className="ga-card" key={photo.id}>
                <img src={photo.image_data} alt={photo.title} loading="lazy" />
                <div className="ga-info">
                  <h2>{photo.title}</h2>
                  {photo.description && <p>{photo.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default GalleryPage;
