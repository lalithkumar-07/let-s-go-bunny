import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <Link to="/" className="nav-logo">
        🐇 TripPlanner
      </Link>

      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/plan">Plan</NavLink></li>
        <li><NavLink to="/stops">Stops</NavLink></li>
        <li><NavLink to="/hotels">Hotels</NavLink></li>
        <li><NavLink to="/guides">Guides</NavLink></li>
      </ul>

      <button
        className="btn btn-primary btn-sm"
        onClick={() => navigate("/plan")}
        style={{ borderRadius: "50px" }}
      >
        Plan a trip
      </button>
    </nav>
  );
}