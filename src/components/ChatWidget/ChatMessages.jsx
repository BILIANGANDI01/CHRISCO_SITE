import { useEffect, useRef } from "react";
import styles from "./ChatWidget.module.css";

export default function ChatMessages({ messages }) {
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.messages}>
      {messages.map((m) => (
        <div key={m.id} className={`${styles.msg} ${m.sender === "user" ? styles.user : styles.admin}`}>
          {m.text}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
