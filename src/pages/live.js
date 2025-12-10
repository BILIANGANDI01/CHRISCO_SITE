import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { doc, onSnapshot } from "firebase/firestore";
import dynamic from "next/dynamic";

const LivePlayer = dynamic(() => import("../components/LivePlayer"), {
  ssr: false,
});

export default function LivePage() {
  const [live, setLive] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "live", "status"), (snap) => {
      if (snap.exists()) setLive(snap.data());
    });
    return () => unsub();
  }, []);

  if (!live) return <p>Chargement…</p>;

  return (
    <main className="container">
      {live.status ? (
        <>
          <h1>🔴 {live.title || "Live en direct"}</h1>
          <LivePlayer src={live.url} />
        </>
      ) : (
        <h1>🔴 Aucun live en cours</h1>
      )}
    </main>
  );
}
