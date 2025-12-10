import styles from "./ChatWidget.module.css";

export default function ChatInput({ msg, setMsg, send }) {
  return (
    <div className={styles.inputArea}>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Écrire un message..."
        onKeyDown={(e) => e.key === "Enter" && send()}
        className={styles.input}
      />
      <button onClick={send} className={styles.sendBtn}>Envoyer</button>
    </div>
  );
}
