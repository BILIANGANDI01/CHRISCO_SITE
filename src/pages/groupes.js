import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Groupes() {
  const [groupes, setGroupes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "groupes"), orderBy("date", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setGroupes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1 className="section-title">🧩 Groupes</h1>

      <section className="card">
        {groupes.length === 0 ? (
          <p>Aucun groupe enregistré.</p>
        ) : (
          <div className="grid">
            {groupes.map((g) => (
              <div key={g.id} className="card">
                <h3>{g.nom}</h3>
                <p>{g.description}</p>
                {g.contact && <p><strong>Contact:</strong> {g.contact}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
