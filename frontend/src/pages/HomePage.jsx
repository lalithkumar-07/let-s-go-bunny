import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Globe from "../components/Globe";
import Navbar from "../components/Navbar";

const CITIES = [
  "Delhi", "Mumbai", "Hyderabad", "Bangalore",
  "Chennai", "Kolkata", "Jaipur", "Pune",
];

const FEATURES = [
  {
    icon: "🗺",
    title: "Real-time route intelligence",
    desc: "Live road routing via OSRM with distance, ETA, and road-level accuracy.",
  },
  {
    icon: "🏛",
    title: "Curated stop discovery",
    desc: "Heritage sites, scenic viewpoints, food spots, and rest areas along every route.",
  },
  {
    icon: "🏨",
    title: "Smart hotel suggestions",
    desc: "Handpicked accommodations at destination and en-route for multi-day trips.",
  },
  {
    icon: "👤",
    title: "Local guide booking",
    desc: "Connect with verified local experts who unlock the soul of every destination.",
  },
  {
    icon: "💰",
    title: "Dynamic pricing engine",
    desc: "Transparent fare tiers — Economy, Smart, and Premium — with live breakdowns.",
  },
  {
    icon: "🚗",
    title: "Multi-mode travel",
    desc: "Road, train, or air — plan any journey across India from a single platform.",
  },
];

const STEPS = [
  { num: "01", label: "Enter your route", desc: "Pick source and destination from 50+ cities across India." },
  { num: "02", label: "Explore the journey", desc: "Discover stops, hotels, and guides along your route." },
  { num: "03", label: "Customise your trip", desc: "Choose shipment type, travel mode, and preferred tier." },
  { num: "04", label: "Book and go", desc: "Confirm in four steps. Get a reference ID instantly." },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("Hyderabad");
  const [to, setTo]     = useState("Mumbai");
  const heroRef   = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePlan = () => {
    if (from === to) return;
    navigate(`/plan?from=${from}&to=${to}`);
  };

  return (
    <div className="home-page">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div
          className="hero-bg"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        />

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-dot" />
              India's intelligent trip planner
            </div>

            <h1 className="hero-title">
              Plan journeys,
              <br />
              <span className="hero-accent">not just routes.</span>
            </h1>

            <p className="hero-subtitle">
              Discover every stop worth making between
              your source and destination — from ancient
              forts to hidden viewpoints, dhabas to five-star hotels.
            </p>

            {/* Search bar */}
            <div className="search-bar">
              <div className="search-field">
                <label>From</label>
                <select value={from} onChange={e => setFrom(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="search-divider">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="#ffd600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="search-field">
                <label>To</label>
                <select value={to} onChange={e => setTo(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button className="search-btn" onClick={handlePlan}>
                Plan trip
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-num">50+</span>
                <span className="stat-lbl">Cities</span>
              </div>
              <div className="stat-sep" />
              <div className="hero-stat">
                <span className="stat-num">200+</span>
                <span className="stat-lbl">Curated stops</span>
              </div>
              <div className="stat-sep" />
              <div className="hero-stat">
                <span className="stat-num">3</span>
                <span className="stat-lbl">Travel modes</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <Globe />
          </div>
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-header">
          <p className="section-tag">What we offer</p>
          <h2 className="section-title">Everything your journey needs</h2>
          <p className="section-sub">
            One platform that turns a simple A-to-B into a complete travel experience.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              className="feature-card"
              key={f.title}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-line" />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-header">
          <p className="section-tag">Process</p>
          <h2 className="section-title">Four steps to your perfect trip</h2>
        </div>

        <div className="steps-row">
          {STEPS.map((s, i) => (
            <div className="step-item" key={s.num}>
              <div className="step-num">{s.num}</div>
              <div className="step-body">
                <h3 className="step-label">{s.label}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to plan your journey?</h2>
          <p className="cta-sub">
            Enter your route and start discovering India one stop at a time.
          </p>
          <button className="cta-btn" onClick={() => navigate("/plan")}>
            Start planning
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">🐇 TripPlanner</div>
        <p className="footer-copy">© 2025 TripPlanner. Built for explorers.</p>
      </footer>

      <style>{`
        /* ── GLOBAL ── */
        .home-page {
          font-family: 'Poppins', sans-serif;
          background: radial-gradient(circle at top left, #42a5f5 0%, #1e88e5 40%, #0d47a1 100%);
          min-height: 100vh;
          color: #fff;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(255,214,0,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 10% 80%, rgba(255,255,255,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 40px;
          padding: 120px 6% 60px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
        .hero-left {
          flex: 1;
          min-width: 0;
          animation: fadeUp 0.9s cubic-bezier(.16,1,.3,1) both;
        }
        .hero-right {
          width: 500px;
          height: 500px;
          flex-shrink: 0;
          animation: fadeIn 1.2s ease both 0.3s;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,214,0,0.15);
          border: 1px solid rgba(255,214,0,0.3);
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 13px;
          color: #ffd600;
          font-weight: 500;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }
        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffd600;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-size: clamp(36px, 5vw, 68px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .hero-accent {
          color: #ffd600;
          position: relative;
        }
        .hero-accent::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,214,0,0.4);
          border-radius: 2px;
          animation: expandWidth 1s ease both 0.8s;
          transform-origin: left;
        }
        @keyframes expandWidth {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .hero-subtitle {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,255,255,0.75);
          max-width: 480px;
          margin-bottom: 36px;
        }

        /* ── SEARCH BAR ── */
        .search-bar {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 8px;
          max-width: 560px;
          margin-bottom: 32px;
          transition: border-color 0.3s;
        }
        .search-bar:focus-within {
          border-color: rgba(255,214,0,0.5);
        }
        .search-field {
          flex: 1;
          padding: 8px 14px;
          min-width: 0;
        }
        .search-field label {
          display: block;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .search-field select {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          appearance: none;
        }
        .search-field select option {
          background: #0d47a1;
          color: #fff;
        }
        .search-divider {
          padding: 0 8px;
          opacity: 0.7;
          flex-shrink: 0;
        }
        .search-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ffd600, #ffea00);
          color: #000;
          border: none;
          border-radius: 10px;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255,214,0,0.4);
        }
        .search-btn:active { transform: translateY(0); }

        /* ── HERO STATS ── */
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .hero-stat { text-align: center; }
        .stat-num {
          display: block;
          font-size: 28px;
          font-weight: 800;
          color: #ffd600;
          line-height: 1;
        }
        .stat-lbl {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
          display: block;
        }
        .stat-sep {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.15);
        }

        /* ── SCROLL HINT ── */
        .hero-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-bottom: 32px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }

        /* ── SECTIONS ── */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .section-tag {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #ffd600;
          margin-bottom: 12px;
        }
        .section-title {
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 800;
          color: #fff;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .section-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── FEATURES ── */
        .features-section {
          padding: 100px 6%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .feature-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s, background 0.3s;
          animation: fadeUp 0.6s ease both;
          cursor: default;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 0% 0%, rgba(255,214,0,0.06), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,214,0,0.25);
          background: rgba(255,255,255,0.09);
        }
        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          font-size: 28px;
          margin-bottom: 16px;
          display: block;
        }
        .feature-title {
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 14px;
          line-height: 1.65;
          color: rgba(255,255,255,0.6);
        }
        .feature-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,214,0,0.4), transparent);
          transform: scaleX(0);
          transition: transform 0.4s;
          transform-origin: left;
        }
        .feature-card:hover .feature-line { transform: scaleX(1); }

        /* ── HOW IT WORKS ── */
        .how-section {
          padding: 100px 6%;
          background: rgba(0,0,0,0.15);
          backdrop-filter: blur(4px);
        }
        .steps-row {
          display: flex;
          align-items: flex-start;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }
        .step-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          padding: 0 16px;
        }
        .step-num {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255,214,0,0.15);
          border: 1.5px solid rgba(255,214,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 800;
          color: #ffd600;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          transition: transform 0.3s, background 0.3s;
        }
        .step-item:hover .step-num {
          transform: scale(1.1);
          background: rgba(255,214,0,0.25);
        }
        .step-connector {
          position: absolute;
          top: 30px;
          left: calc(50% + 36px);
          right: calc(-50% + 36px);
          height: 1px;
          background: linear-gradient(90deg, rgba(255,214,0,0.4), rgba(255,214,0,0.1));
        }
        .step-label {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }
        .step-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          max-width: 200px;
          margin: 0 auto;
        }

        /* ── CTA ── */
        .cta-section {
          padding: 100px 6%;
          text-align: center;
        }
        .cta-inner {
          background: rgba(255,214,0,0.08);
          border: 1px solid rgba(255,214,0,0.2);
          border-radius: 28px;
          padding: 72px 48px;
          max-width: 720px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .cta-inner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(255,214,0,0.06), transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 800;
          color: #fff;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .cta-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.65);
          margin-bottom: 36px;
          line-height: 1.7;
        }
        .cta-btn {
          background: linear-gradient(135deg, #ffd600, #ffea00);
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 16px 48px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255,214,0,0.45);
        }

        /* ── FOOTER ── */
        .footer {
          padding: 32px 6%;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-logo {
          font-size: 18px;
          font-weight: 700;
          color: #ffd600;
        }
        .footer-copy {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }

        @media (max-width: 900px) {
          .hero-content { flex-direction: column; padding-top: 100px; }
          .hero-right { width: 100%; height: 320px; }
          .steps-row { flex-direction: column; gap: 32px; }
          .step-connector { display: none; }
        }
      `}</style>
    </div>
  );
}
