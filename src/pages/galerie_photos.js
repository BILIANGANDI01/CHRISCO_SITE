import { useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Modal from "react-modal";

Modal.setAppElement("#__next");

export default function GaleriePhotos() {
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "albums", "photos", "list"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      <h1 className="section-title">🖼 Galerie Photos</h1>

      <div className="grid photos-grid">
        {photos.map((p, i) => (
          <div key={i} className="photo-thumb" onClick={() => { setIndex(i); setOpen(true); }}>
            <img src={p.url} />
          </div>
        ))}
      </div>

      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <button className="modal-close" onClick={() => setOpen(false)}>✕</button>
        <img src={photos[index]?.url} className="modal-img" />
        <div>{photos[index]?.title}</div>
      </Modal>
    </main>
  );
}
