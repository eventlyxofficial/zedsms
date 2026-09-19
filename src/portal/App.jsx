import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { TweaksPanel, TweakSection, TweakColor, TweakRadio } from "./components/TweaksPanel";
import { useTweaks } from "./hooks/useTweaks";
import { HomeScreen, NumbersScreen } from "./screens/screens1";
import { BuyScreen, TopUpScreen, TransferScreen, TransactionsScreen, SettingsScreen } from "./screens/screens2";
import { Icon } from "./components/Icon";
import { LogoMark } from "./components/LogoMark";
import { logout as apiLogout } from "./api/auth";

// ============ RESPONSIVE + APP STYLES ============
const appCss = `
.mobile-only-flex { display: none !important; }
.layout { display: flex; align-items: flex-start; max-width: 1440px; margin: 0 auto; }
.content-wrap { flex: 1; min-width: 0; }
.content-inner { max-width: 1180px; margin: 0 auto; padding: var(--content-pad); }

@media (max-width: 1080px) {
  .home-grid { grid-template-columns: 1fr !important; }
  .numbers-layout { grid-template-columns: 1fr !important; }
  .numbers-layout > *:first-child { position: static !important; }
  .buy-layout { grid-template-columns: 1fr !important; }
}
@media (max-width: 880px) {
  .sidebar { position: fixed !important; left: 0; top: 0; transform: translateX(-100%); transition: transform 0.26s cubic-bezier(0.22,1,0.36,1); box-shadow: var(--shadow-pop); }
  .sidebar[data-open="true"] { transform: translateX(0); }
  .mobile-only-flex { display: flex !important; }
  .desktop-only { display: none !important; }
  .svc-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .settings-layout { grid-template-columns: 1fr !important; }
  .settings-tabs { flex-direction: row !important; overflow-x: auto; position: static !important; }
  .content-inner { padding: 16px; }
  .topbar-search { display: none !important; }
}
@media (max-width: 560px) {
  .svc-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .country-grid { grid-template-columns: 1fr !important; }
}
`;

export default function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "#2F54EB",
    "density": "regular",
    "corners": "soft"
  }/*EDITMODE-END*/;
  const [route, setRoute] = React.useState("home");
  const [theme, setTheme] = React.useState(() => localStorage.getItem("zedsms-theme") || "light");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [pendingNumber, setPendingNumber] = React.useState(null);
  const [loggedOut, setLoggedOut] = React.useState(false);
  const scrollRef = React.useRef(null);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const handleLogout = () => {
    apiLogout();
    setLoggedOut(true);
  };

  const DENSITY = {
    compact: { sw: "220px", pad: "18px" },
    regular: { sw: "248px", pad: "24px" },
    roomy: { sw: "276px", pad: "32px" },
  };
  const CORNERS = { sharp: ["10px", "8px"], soft: ["16px", "11px"], round: ["22px", "14px"] };

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("zedsms-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    const r = document.documentElement.style;
    const acc = theme === "dark" ? `color-mix(in srgb, ${t.accent} 68%, white)` : t.accent;
    r.setProperty("--accent", acc);
    const d = DENSITY[t.density] || DENSITY.regular;
    r.setProperty("--sidebar-w", d.sw);
    r.setProperty("--content-pad", d.pad);
    const c = CORNERS[t.corners] || CORNERS.soft;
    r.setProperty("--r-card", c[0]);
    r.setProperty("--r-ctrl", c[1]);
  }, [t.accent, t.density, t.corners, theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const goNumbers = (id) => { setPendingNumber(id); setRoute("numbers"); };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    // keyboard shortcut: cmd/ctrl-B -> buy
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { e.preventDefault(); setRoute("buy"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [route]);

  let screen;
  if (route === "home") screen = <HomeScreen setRoute={setRoute} openNumber={goNumbers} />;
  else if (route === "numbers") screen = <NumbersScreen initialNumberId={pendingNumber} clearInitial={() => setPendingNumber(null)} />;
  else if (route === "buy") screen = <BuyScreen setRoute={setRoute} openNumber={goNumbers} />;
  else if (route === "topup") screen = <TopUpScreen />;
  else if (route === "transfer") screen = <TransferScreen />;
  else if (route === "transactions") screen = <TransactionsScreen />;
  else if (route === "settings") screen = <SettingsScreen theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />;

  if (loggedOut) {
    return (
      <>
        <style>{appCss}</style>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 24 }}>
          <LogoMark size={38} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>You've been logged out</div>
            <div style={{ fontSize: 13.5, color: "var(--text-muted)" }}>Sign back in to access your ZEDSMS account.</div>
          </div>
          <button onClick={() => setLoggedOut(false)}
            style={{ height: 42, padding: "0 22px", borderRadius: 11, background: "var(--accent)", color: "#fff", fontSize: 13.5, fontWeight: 550, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon name="logout" size={16} style={{ transform: "scaleX(-1)" }} /> Log back in
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{appCss}</style>
      <div className="layout">
        <Sidebar route={route} setRoute={setRoute} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={handleLogout} />
        <div className="content-wrap">
          <Topbar route={route} setRoute={setRoute} theme={theme} toggleTheme={toggleTheme} setMobileOpen={setMobileOpen} />
          {import.meta.env.DEV && (
            <TweaksPanel>
              <TweakSection label="Brand accent" />
              <TweakColor label="Accent" value={t.accent}
                options={["#2F54EB", "#5B54E8", "#0E9384", "#7C5CE0", "#0B6BCB"]}
                onChange={(v) => setTweak("accent", v)} />
              <TweakSection label="Layout" />
              <TweakRadio label="Density" value={t.density}
                options={["compact", "regular", "roomy"]}
                onChange={(v) => setTweak("density", v)} />
              <TweakRadio label="Corners" value={t.corners}
                options={["sharp", "soft", "round"]}
                onChange={(v) => setTweak("corners", v)} />
              <TweakSection label="Theme" />
              <TweakRadio label="Mode" value={theme}
                options={["light", "dark"]}
                onChange={(v) => setTheme(v)} />
            </TweaksPanel>
          )}
          <main ref={scrollRef} className="content-inner" key={route}>
            {screen}
          </main>
        </div>
      </div>
    </>
  );
}
