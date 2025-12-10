export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">

        {/* LOGO & DESCRIPTION */}
        <div className="col">
          <img src="/images/logo.png" alt="CHRISCO" style={{ height: 56 }} />
          <p>CHRISCO — Christ et Compagnons. Un lieu de restauration spirituelle.</p>
        </div>

        {/* NAVIGATION */}
        <div className="col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/apropos">À propos</a></li>
            <li><a href="/programme">Programme</a></li>
            <li><a href="/chrisco-tv">CHRISCO TV</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="col">
          <h4>Contact</h4>
          <p>Email: contact@chrisco.com</p>
          <p>Tél: +243 000 000</p>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="col">
          <h4>Suis-nous</h4>

          <div className="social-links">

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <img src="/icons/youtube.svg" alt="YouTube" />
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <img src="/icons/facebook.svg" alt="Facebook" />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <img src="/icons/instagram.svg" alt="Instagram" />
            </a>

          </div>

          <p style={{ fontSize: 12, opacity: 0.8, marginTop: 12 }}>
            © {new Date().getFullYear()} CHRISCO
          </p>
        </div>
      </div>

      {/* STYLE (optionnel mais pratique) */}
      <style jsx>{`
        .social-links {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .social-icon img {
          width: 28px;
          height: 28px;
          transition: 0.2s ease;
        }
        .social-icon img:hover {
          transform: scale(1.15);
        }
      `}</style>
    </footer>
  );
}
