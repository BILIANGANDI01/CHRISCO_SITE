import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function LivePlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
      } else {
        videoRef.current.src = src;
      }
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      style={{ width: "100%", borderRadius: 12 }}
    />
  );
}
