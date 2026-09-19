import React from "react";
import { Icon } from "./Icon";
import { Button } from "./ui/Button";
import { ServiceAvatar } from "./ui/Avatars";
import { PAGE_TITLES } from "./nav";
import { useMessages } from "../hooks/useMessages";

export const Topbar = ({ route, setRoute, theme, toggleTheme, setMobileOpen }) => {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const { data: messages = [] } = useMessages();

  return (
    <header style={{ position: "sticky", top: 10, zIndex: 30, background: "color-mix(in srgb, var(--bg) 82%, transparent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, height: 64, padding: "0 24px", maxWidth: 1180, margin: "0 auto" }}>
        <button onClick={() => setMobileOpen(true)} className="mobile-only-flex" style={{ color: "var(--text-muted)" }}><Icon name="menu" size={22} /></button>
        <div className="desktop-only">
          <h1 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em" }}>{PAGE_TITLES[route]}</h1>
        </div>

        {/* search */}
        <div className="topbar-search" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 13px", borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-faint)", minWidth: 220, maxWidth: 320, flex: "0 1 auto" }}>
          <Icon name="search" size={16} />
          <input placeholder="Search numbers, codes…" style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", fontSize: 13.5, width: "100%" }} />
        </div>

        <Button icon="plus" size="md" onClick={() => setRoute("buy")} className="desktop-only">Buy number</Button>

        <button onClick={toggleTheme} title="Toggle theme" style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
        </button>

        {/* notifications */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setNotifOpen(!notifOpen)} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", position: "relative" }}>
            <Icon name="bell" size={18} />
            <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 99, background: "var(--accent)", border: "2px solid var(--surface-2)" }} />
          </button>
          {notifOpen && (
            <>
              <div onClick={() => setNotifOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
              <div style={{ position: "absolute", right: 0, top: 46, width: 320, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--shadow-pop)", zIndex: 50, overflow: "hidden", animation: "popIn 0.16s ease both" }}>
                <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                  <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>Mark all read</span>
                </div>
                {messages.slice(0, 3).map((m) => (
                  <div key={m.id} style={{ display: "flex", gap: 11, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                    <ServiceAvatar color={m.color} letter={m.letter} size={30} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>New code from {m.from}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.body}</div>
                      <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{m.time}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setRoute("numbers"); setNotifOpen(false); }} style={{ width: "100%", padding: "11px", fontSize: 12.5, fontWeight: 500, color: "var(--accent)" }}>View all messages</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
