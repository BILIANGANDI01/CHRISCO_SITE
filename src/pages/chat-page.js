import dynamic from "next/dynamic";
const ChatWidget = dynamic(
  () => import("../components/ChatWidget/ChatWidget"),
  { ssr: false }
);

export default function ChatPage() {
  return (
    <main className="container">
      <h1 className="section-title">💬 Chat</h1>

      <section className="card">
        <p>Discute avec l’équipe CHRISCO. Réponse en direct.</p>
        <div style={{ height: 600 }}>
          <ChatWidget />
        </div>
      </section>
    </main>
  );
}
