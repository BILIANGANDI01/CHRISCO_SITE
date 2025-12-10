import styles from "./ChatWidget.module.css";

export default function ChatHeader({ onClose }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <img src="/icons/admin-avatar.png" className={styles.avatar} />
        <div>
          <strong>Support CHRISCO</strong>
          <small className={styles.online}>En ligne</small>
        </div>
      </div>

      <button className={styles.closeBtn} onClick={onClose}>✖</button>
    </div>
  );
}
