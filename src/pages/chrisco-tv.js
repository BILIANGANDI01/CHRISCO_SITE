import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const LivePlayer = dynamic(() => import("../components/LivePlayer"), {
  ssr: false,
});

export default function ChriscoTV() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(null);
  const [liveActive, setLiveActive] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");

  // Récup vidéos en live
  useEffect(() => {
    const q = query(
      collection(db, "albums", "videos", "list"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setVideos(list);
      setCurrent(list[0] || null);
    });

    return () => unsub();
  }, []);

  // Live TV instantané
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "live"), (snap) => {
      snap.forEach((d) => {
        setLiveActive(d.data().status === true);
        setLiveUrl(d.data().url || "");
      });
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1>CHRISCO TV</h1>

      {/* LIVE */}
      {liveActive && liveUrl && (
        <div className="card live-banner">
          <h2>🔴 EN DIRECT</h2>
          <LivePlayer src={liveUrl} />
        </div>
      )}

      {/* LECTEUR */}
      {current && (
        <div className="card tv-player">
          <ReactPlayer url={current.url} width="100%" height="400px" controls />
          <h2>{current.titre}</h2>
        </div>
      )}

      {/* PLAYLIST */}
      <div className="playlist">
        {videos.map((v) => (
          <div key={v.id} className="playlist-item" onClick={() => setCurrent(v)}>
            <img src={v.thumbnail} />
            <p>{v.titre}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
