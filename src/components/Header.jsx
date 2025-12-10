import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const [liveActive, setLiveActive] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "live", "status"), (d) => {
      setLiveActive(d.exists() && d.data().status === true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("dark-mode");
    if (saved === "true") setDarkMode(true);
    document.documentElement.setAttribute(
      "data-theme",
      saved === "true" ? "dark" : "light"
    );
  }, []);

  const toggleTheme = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("dark-mode", newVal);
    document.documentElement.setAttribute(
      "data-theme",
      newVal ? "dark" : "light"
    );
  };

  const menu = [
    { href: "/", label: "Accueil", icon: "🏠" },
    { href: "/apropos", label: "À propos", icon: "ℹ️" },
    { href: "/programme", label: "Programme", icon: "🗓️" },
    { href: "/ministeres", label: "Ministères", icon: "🧭" },
    { href: "/organigramme", label: "Organigramme", icon: "👥" },

    {
      label: "Galerie",
      icon: "🖼️",
      children: [
        { href: "/galerie_photos", label: "Photos", icon: "📷" },
        { href: "/chrisco-tv", label: "Vidéos", icon: "🎞️" },
      ],
    },

    { href: "/ecole_biblique", label: "École Biblique", icon: "📚" },
    { href: "/groupes", label: "Groupes", icon: "🧩" },
    { href: "/implantations", label: "Implantations", icon: "📍" },
    { href: "admin/admin.html", label: "Administration", icon: "⚙️" },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <header className="site-header sticky">
      <div className="container header-inner">
        {/* LOGO */}
        <div className="brand">
          <img
            src="Images/LOGO CHRISCO dac.png"
            className="logo"
            alt="CHRISCO"
          />
          <div className="brand-text">
            <span className="title">CHRISCO</span>
            <small className="tag">Christ et Compagnons</small>
          </div>
        </div>

        {/* BURGER BUTTON */}
        <button className="nav-toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        {/* NAV */}
        <nav className={`main-nav ${open ? "open" : ""}`}>
          {/* DON */}
          <a href="/don" className="btn-don">
            💝 Don en ligne
          </a>

          {/* LIVE */}
          <a href="/chrisco-tv" className="btn-live">
            🔴 CHRISCO TV Live
          </a>

          {/* MENU */}
          {menu.map((item, i) =>
            item.children ? (
              <div
                key={i}
                className={`dropdown ${dropdown === i ? "open" : ""}`}
                onMouseEnter={() => setDropdown(i)}
                onMouseLeave={() => setDropdown(null)}
              >
                <button className="dropdown-btn">
                  {item.icon} {item.label} ▾
                </button>

                <div className="dropdown-menu">
                  {item.children.map((child, j) => (
                    <Link key={j} href={child.href}>
                      <span
                        className={isActive(child.href) ? "active" : ""}
                      >
                        {child.icon} {child.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={i} href={item.href}>
                <span className={isActive(item.href) ? "active" : ""}>
                  {item.icon} {item.label}
                </span>
              </Link>
            )
          )}

          {/* DARK MODE */}
          <button className="theme-switch" onClick={toggleTheme}>
            {darkMode ? "🌙 Sombre" : "☀️ Clair"}
          </button>
        </nav>
      </div>
    </header>
  );
}
