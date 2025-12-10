import { useEffect, useState } from "react";
import { db } from "../../lib/firebaseClient";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import styles from "./ChatWidget.module.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let uid = localStorage.getItem("chatUserId");
    if (!uid) {
      uid = "user_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("chatUserId", uid);
    }
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "chat", userId, "messages"),
      orderBy("timestamp", "asc")
    );

    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [userId]);

  // message de bienvenue  
  useEffect(() => {
    if (!open || !userId) return;
    const key = "welcome_" + userId;

    if (!localStorage.getItem(key)) {
      addDoc(collection(db, "chat", userId, "messages"), {
        sender: "admin",
        text: "Bonjour 👋 ! Comment puis-je vous aider aujourd’hui ?",
        timestamp: serverTimestamp(),
      });
      localStorage.setItem(key, "true");
    }
  }, [open, userId]);

  const send = async () => {
    if (!msg.trim()) return;

    await addDoc(collection(db, "chat", userId, "messages"), {
      sender: "user",
      text: msg,
      timestamp: serverTimestamp(),
    });

    setMsg("");
  };

  return (
    <>
      <button className={styles.chatBtn} onClick={() => setOpen(!open)}>
        💬
      </button>

      <div className={`${styles.chatPanel} ${open ? styles.show : ""}`}>
        <ChatHeader onClose={() => setOpen(false)} />
        <ChatMessages messages={messages} />
        <ChatInput msg={msg} setMsg={setMsg} send={send} />
      </div>
    </>
  );
}
