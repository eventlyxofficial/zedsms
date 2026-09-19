import { Icon } from "../Icon";

export const Empty = ({ icon = "msg", label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "44px 0", gap: 12, color: "var(--text-faint)" }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={20} />
    </div>
    <span style={{ fontSize: 13 }}>{label}</span>
  </div>
);
