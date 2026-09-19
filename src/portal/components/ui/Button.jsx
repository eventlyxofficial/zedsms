import React from "react";
import { Icon } from "../Icon";
import { cx } from "../../lib/cx";

export const Button = ({ children, variant = "primary", size = "md", icon, iconRight, full, className = "", ...rest }) => {
  const sizes = {
    sm: { padding: "0 12px", height: 32, fontSize: 13, gap: 6, radius: 9 },
    md: { padding: "0 15px", height: 38, fontSize: 13.5, gap: 7, radius: 10 },
    lg: { padding: "0 20px", height: 46, fontSize: 15, gap: 8, radius: 12 },
  }[size];
  const variants = {
    primary: { background: "var(--accent)", color: "#fff", border: "1px solid transparent" },
    soft: { background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent-border)" },
    ghost: { background: "transparent", color: "var(--text)", border: "1px solid var(--border-strong)" },
    subtle: { background: "var(--surface-2)", color: "var(--text)", border: "1px solid transparent" },
    danger: { background: "var(--danger-soft)", color: "var(--danger)", border: "1px solid transparent" },
  };
  const [hover, setHover] = React.useState(false);
  const v = variants[variant];
  return (
    <button {...rest}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={cx("tnum", className)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: sizes.gap,
        height: sizes.height, padding: sizes.padding, fontSize: sizes.fontSize, fontWeight: 500,
        borderRadius: sizes.radius, width: full ? "100%" : undefined, whiteSpace: "nowrap",
        transition: "all 0.16s ease", letterSpacing: "-0.01em",
        ...v,
        filter: hover ? (variant === "primary" ? "brightness(1.06)" : "none") : "none",
        background: hover && variant === "subtle" ? "var(--surface-3)" : v.background,
        transform: hover && !rest.disabled ? "translateY(-1px)" : "none",
        opacity: rest.disabled ? 0.45 : 1,
        cursor: rest.disabled ? "not-allowed" : "pointer",
        pointerEvents: rest.disabled ? "none" : undefined,
      }}>
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 18 : 16} />}
    </button>
  );
};
