import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { db } from "../lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import HomeHero from "../components/HomeHero";

const ChatWidget = dynamic(
  () => import("../components/ChatWidget/ChatWidget"),
  { ssr: false }
);

export default function Home() {
  const [apropos, setApropos] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "apropos", "infos"), (snap) => {
      if (snap.exists()) {
        setApropos(snap.data());
      }
    });
    return () => unsub();
  }, []);

  return (
    <main className="container">
      <HomeHero />

      <section className="card" style={{ marginTop: 40 }}>
        <h2>🕊 Bienvenue à CHRISCO</h2>
        <p>
          {apropos.historiqueHtml_fr ||
            apropos.historiqueHtml ||
            "Bienvenue dans notre communauté chrétienne."}
        </p>
      </section>

      <section className="card" style={{ marginTop: 40 }}>
        <h2>🌟 Notre Vision</h2>
        <p>
          {apropos.visionHtml_fr ||
            apropos.visionHtml ||
            "Proclamer l’Évangile, former des disciples et manifester l’amour de Christ."}
        </p>
      </section>

      <ChatWidget />
    </main>
  );
}
