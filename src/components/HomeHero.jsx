export default function HomeHero({ title = "Bienvenue à l'Église CHRISCO", subtitle = "Sanctuaire de la restauration — Joignez-vous à nous." }) {
  return (
    <section className="hero card hero-lg">
      <div className="container hero-grid">
        <div className="hero-text">
          <h1>{title}</h1>
          <p className="lead">{subtitle}</p>
          <div style={{display:'flex',gap:10,marginTop:14}}>
            <a className="btn btn-primary" href="/programme">Voir le programme</a>
            <a className="btn btn-outline" href="/chrisco-tv">CHRISCO TV</a>
            <a className="btn btn-don" href="/don">Don en ligne</a>
          </div>
       
        </div>
        <div className="hero-media">
          <img src="Images/Bannière CHRISCO sous un ciel serein.png" alt="église" className="hero-img" />
        </div>
      </div>
    </section>
  );
}
