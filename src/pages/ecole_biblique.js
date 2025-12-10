import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";

export default function EcoleBiblique() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "ecole", "infos"), (snap) => {
      if (snap.exists()) {
        setContent(snap.data().contenuHtml || "");
      }
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1 className="section-title">📚 École Biblique</h1>

      <section className="card">
        <div
          dangerouslySetInnerHTML={{
            __html: content || "<p>Contenu indisponible.</p>",
          }}
        />
      </section>
    </main>
  );
}
