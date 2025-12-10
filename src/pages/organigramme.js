import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseClient";

export default function Organigramme() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "organigramme"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setNodes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1 className="section-title">👥 Organigramme</h1>

      <section className="card">
        {nodes.length === 0 ? (
          <p>Aucun enregistrement.</p>
        ) : (
          <table className="admin-table" style={{ width: "100%" }}>
            <thead>
              <tr><th>Poste</th><th>Nom</th><th>Contact</th></tr>
            </thead>
            <tbody>
              {nodes.map((n) => (
                <tr key={n.id}>
                  <td>{n.poste}</td>
                  <td>{n.nom}</td>
                  <td>{n.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
