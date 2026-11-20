import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#18172f", color: "#fffdf2", fontFamily: "sans-serif" }}>
    <div style={{ color: "#ffd35d", fontSize: 28, letterSpacing: 8 }}>WORLD 1-1 · PORTFOLIO</div>
    <div style={{ display: "flex", fontSize: 110, fontWeight: 900, marginTop: 20 }}>Arpit Yadav<span style={{ color: "#ffd35d" }}>.</span></div>
    <div style={{ fontSize: 42, color: "#b9b5d2", marginTop: 18 }}>Frontend engineer. Curious builder.</div>
    <div style={{ display: "flex", marginTop: 65, gap: 15 }}>{["REACT", "NEXT.JS", "TYPESCRIPT"].map((word) => <div key={word} style={{ border: "2px solid #ffd35d", color: "#ffd35d", borderRadius: 10, padding: "12px 18px", fontSize: 23 }}>{word}</div>)}</div>
    <div style={{ position: "absolute", right: 80, top: 80, color: "#6ce1b8", fontSize: 100 }}>✦</div>
  </div>, size);
}
