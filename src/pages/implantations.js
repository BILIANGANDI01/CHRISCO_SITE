import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Implantations() {
  const [impl, setImpl] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "implantations"), orderBy("nom", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      setImpl(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1 className="section-title">📍 Implantations / Paroisses</h1>

      <section className="card">
        {impl.length === 0 ? (
          <p>Aucune implantation répertoriée.</p>
        ) : (
          <div className="grid">
            {impl.map((i) => (
              <div key={i.id} className="card">
                <h3>{i.nom}</h3>
                <p>{i.adresse}</p>
                {i.contact && <p><strong>Contact:</strong> {i.contact}</p>}
                {i.gps && <p className="small-muted">GPS: {i.gps}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
