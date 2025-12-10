import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import Calendar from "../components/Calendar";

export default function Programme() {
  const [semaine, setSemaine] = useState([]);
  const [events, setEvents] = useState([]);

  // Programme en temps réel
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "programme", "semaine"), (snap) => {
      if (snap.exists()) {
        setSemaine(snap.data().programmes || []);
      }
    });

    return () => unsub();
  }, []);

  // Événements calendrier en temps réel
  useEffect(() => {
    const q = query(
      collection(db, "programme", "evenements", "events"),
      orderBy("date", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1>Programme Hebdomadaire</h1>

      <div className="card schedule-grid">
        {semaine.length === 0 ? (
          <p>Aucun programme.</p>
        ) : (
          semaine.map((p, i) => (
            <div className="schedule-item" key={i}>
              <div className="si-left">
                <div className="day">{p.jour}</div>
                <div className="time">{p.heure}</div>
              </div>
              <div className="si-right">
                <div className="title">{p.titre}</div>
                {p.description && <div className="desc">{p.description}</div>}
              </div>
            </div>
          ))
        )}
      </div>

      <h2 style={{ marginTop: 20 }}>Événements</h2>
      <div className="card">
        <Calendar
          events={events.map((ev) => ({
            title: ev.titre,
            start: ev.date,
            id: ev.id,
          }))}
        />
      </div>
    </main>
  );
}
