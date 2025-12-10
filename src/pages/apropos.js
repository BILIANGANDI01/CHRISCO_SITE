import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";

export default function Apropos() {
  const [data, setData] = useState({
    historique: "",
    vision: "",
    objectifs: "",
    moyens: "",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "apropos", "infos"), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setData({
          historique: d.historiqueHtml_fr || d.historiqueHtml || "",
          vision: d.visionHtml_fr || d.visionHtml || "",
          objectifs: d.objectifsHtml_fr || d.objectifsHtml || "",
          moyens: d.moyensHtml_fr || d.moyensHtml || "",
        });
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="container">
      <h1>À propos</h1>

      <section className="card">
        <h2>Historique</h2>
        <div dangerouslySetInnerHTML={{ __html: data.historique }} />
      </section>

      <section className="card">
        <h2>Vision</h2>
        <div dangerouslySetInnerHTML={{ __html: data.vision }} />
      </section>

      <section className="card">
        <h2>Objectifs</h2>
        <div dangerouslySetInnerHTML={{ __html: data.objectifs }} />
      </section>

      <section className="card">
        <h2>Moyens d'action</h2>
        <div dangerouslySetInnerHTML={{ __html: data.moyens }} />
      </section>
    </div>
  );
}
