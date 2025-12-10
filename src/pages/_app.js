import "../styles/globals.css";
import "../styles/theme.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("../components/ChatWidget/ChatWidget"),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />

      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        <Component {...pageProps} />
      </main>

      <ChatWidget />

      <Footer />
    </>
  );
}
