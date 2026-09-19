import { flag } from "../../lib/flag";

export const ServiceAvatar = ({ color, letter, size = 38 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.32, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: size * 0.42, flexShrink: 0, letterSpacing: "-0.02em" }}>
    {letter}
  </div>
);

export const FlagAvatar = ({ iso, size = 38 }) => (
  <div style={{ width: size, height: size, borderRadius: 99, overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)", background: "var(--surface-2)" }}>
    <img src={flag(iso)} alt={iso} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);
