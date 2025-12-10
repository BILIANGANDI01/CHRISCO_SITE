import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseClient";

export default function Ministeres() {
  const [mins, setMins] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "ministeres"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setMins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1 className="section-title">🧭 Ministères</h1>

      <section className="card">
        {mins.length === 0 ? (
          <p>Aucun ministère pour le moment.</p>
        ) : (
          <div className="grid">
            {mins.map((m) => (
              <div key={m.id} className="card">
                <h3>{m.nom}</h3>
                <p className="small-muted">{m.responsable}</p>
                <p>{m.description}</p>
                {m.contact && <p><strong>Contact:</strong> {m.contact}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
