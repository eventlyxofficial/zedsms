import { cx } from "../../lib/cx";

export const Badge = ({ children, tone = "neutral", dot, className = "" }) => {
  const tones = {
    neutral: { bg: "var(--surface-2)", fg: "var(--text-muted)" },
    accent: { bg: "var(--accent-soft)", fg: "var(--accent)" },
    success: { bg: "var(--success-soft)", fg: "var(--success)" },
    warning: { bg: "var(--warning-soft)", fg: "var(--warning)" },
    danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
    solid: { bg: "var(--text)", fg: "var(--surface)" },
  };
  const t = tones[tone];
  return (
    <span className={cx("tnum", className)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2.5px 9px", borderRadius: 99, fontSize: 11.5, fontWeight: 500, background: t.bg, color: t.fg, letterSpacing: "0.01em" }}>
      {dot && <span style={{ width: 5.5, height: 5.5, borderRadius: 99, background: "currentColor" }} />}
      {children}
    </span>
  );
};
