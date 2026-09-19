import React from "react";
import { createPortal } from "react-dom";
import { Icon } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { FlagAvatar, ServiceAvatar } from "../components/ui/Avatars";
import { CodeChip } from "../components/ui/CodeChip";
import { Modal } from "../components/ui/Modal";
import { COUNTRIES, LOGIN_METHODS, NUMBERS, SERVICES, TRANSACTIONS, USER } from "../mocks/seed";
import { NotificationsSettings } from "./notifications";
import { userInitial } from "../lib/userInitial";

// ============ BUY NUMBER ============
// US states with a representative area code — private US numbers are picked by state.
const US_STATES = [
  ["AL", "Alabama", "205"], ["AK", "Alaska", "907"], ["AZ", "Arizona", "602"], ["AR", "Arkansas", "501"],
  ["CA", "California", "415"], ["CO", "Colorado", "303"], ["CT", "Connecticut", "203"], ["DE", "Delaware", "302"],
  ["FL", "Florida", "305"], ["GA", "Georgia", "404"], ["HI", "Hawaii", "808"], ["ID", "Idaho", "208"],
  ["IL", "Illinois", "312"], ["IN", "Indiana", "317"], ["IA", "Iowa", "515"], ["KS", "Kansas", "316"],
  ["KY", "Kentucky", "502"], ["LA", "Louisiana", "504"], ["ME", "Maine", "207"], ["MD", "Maryland", "410"],
  ["MA", "Massachusetts", "617"], ["MI", "Michigan", "313"], ["MN", "Minnesota", "612"], ["MS", "Mississippi", "601"],
  ["MO", "Missouri", "314"], ["MT", "Montana", "406"], ["NE", "Nebraska", "402"], ["NV", "Nevada", "702"],
  ["NH", "New Hampshire", "603"], ["NJ", "New Jersey", "201"], ["NM", "New Mexico", "505"], ["NY", "New York", "212"],
  ["NC", "North Carolina", "704"], ["ND", "North Dakota", "701"], ["OH", "Ohio", "216"], ["OK", "Oklahoma", "405"],
  ["OR", "Oregon", "503"], ["PA", "Pennsylvania", "215"], ["RI", "Rhode Island", "401"], ["SC", "South Carolina", "803"],
  ["SD", "South Dakota", "605"], ["TN", "Tennessee", "615"], ["TX", "Texas", "214"], ["UT", "Utah", "801"],
  ["VT", "Vermont", "802"], ["VA", "Virginia", "703"], ["WA", "Washington", "206"], ["WV", "West Virginia", "304"],
  ["WI", "Wisconsin", "414"], ["WY", "Wyoming", "307"],
];

// Deterministic pseudo-random from a seed string — keeps the available-number pool stable per country/state/batch.
const _numSeed = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822519); h = Math.imul(h ^ (h >>> 13), 3266489917); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; };
const _d = (rnd, n) => Array.from({ length: n }, () => Math.floor(rnd() * 10)).join("");

// Generate a batch of available private numbers for a country (or a US state).
const genAvailableNumbers = (iso, stateCode, batch) => {
  const rnd = _numSeed(`${iso}-${stateCode || "x"}-${batch}`);
  const fmt = {
    us: () => { const st = US_STATES.find((s) => s[0] === stateCode) || US_STATES[4]; return `+1 (${st[2]}) ${_d(rnd, 3)} ${_d(rnd, 4)}`; },
    gb: () => `+44 77${_d(rnd, 2)} ${_d(rnd, 3)} ${_d(rnd, 3)}`,
    ca: () => { const codes = ["416", "604", "514", "647", "403", "613"]; return `+1 (${codes[Math.floor(rnd() * codes.length)]}) ${_d(rnd, 3)} ${_d(rnd, 4)}`; },
    au: () => `+61 4${_d(rnd, 2)} ${_d(rnd, 3)} ${_d(rnd, 3)}`,
  };
  const make = fmt[iso] || (() => `${(COUNTRIES.find((c) => c.iso === iso) || {}).code || "+1"} ${_d(rnd, 3)} ${_d(rnd, 3)} ${_d(rnd, 4)}`);
  const seen = new Set();
  const out = [];
  while (out.length < 9) { const n = make(); if (!seen.has(n)) { seen.add(n); out.push(n); } }
  return out;
};

// Searchable state dropdown (select2-style): trigger opens a panel with a search box + filtered list.
const StateSelect = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const rootRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const cur = US_STATES.find((s) => s[0] === value) || US_STATES[4];
  const filtered = US_STATES.filter(([code, name, area]) => {
    const t = q.trim().toLowerCase();
    return !t || name.toLowerCase().includes(t) || code.toLowerCase().includes(t) || area.includes(t);
  });
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    setTimeout(() => searchRef.current && searchRef.current.focus(), 10);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const pick = (code) => { onChange(code); setOpen(false); setQ(""); };
  return (
    <div ref={rootRef} style={{ position: "relative", flex: 1, maxWidth: 300 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", height: 42, padding: "0 12px", borderRadius: 11, border: `1px solid ${open ? "var(--accent-border)" : "var(--border-strong)"}`, background: "var(--surface)", color: "var(--text)", fontSize: 13.5, fontWeight: 500, textAlign: "left", transition: "border-color 0.14s" }}>
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur[1]}</span>
        <span className="mono tnum" style={{ fontSize: 12, color: "var(--text-faint)", flexShrink: 0 }}>({cur[2]})</span>
        <span style={{ color: "var(--text-faint)", display: "flex", flexShrink: 0, transform: open ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform 0.15s" }}><Icon name="chevR" size={15} /></span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60, background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 12, boxShadow: "var(--shadow-pop)", overflow: "hidden", animation: "fadeIn 0.14s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 40, borderBottom: "1px solid var(--border)", color: "var(--text-faint)" }}>
            <Icon name="search" size={14} />
            <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search state or area code…"
              style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", fontSize: 13, width: "100%" }} />
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto", padding: 5 }}>
            {filtered.length === 0 && <div style={{ padding: "14px 12px", fontSize: 12.5, color: "var(--text-faint)", textAlign: "center" }}>No states match “{q}”</div>}
            {filtered.map(([code, name, area]) => {
              const sel = code === value;
              return (
                <button key={code} onClick={() => pick(code)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 8, textAlign: "left",
                  background: sel ? "var(--accent-soft)" : "transparent", color: sel ? "var(--accent)" : "var(--text)", fontSize: 13, fontWeight: sel ? 550 : 450 }}>
                  <span style={{ flex: 1 }}>{name}</span>
                  <span className="mono tnum" style={{ fontSize: 11.5, color: sel ? "var(--accent)" : "var(--text-faint)" }}>({area})</span>
                  {sel && <Icon name="check" size={14} strokeWidth={2.4} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const BuyScreen = ({ setRoute, openNumber }) => {
  const [type, setType] = React.useState("Private");
  const [svc, setSvc] = React.useState(SERVICES[0]);
  const [country, setCountry] = React.useState(COUNTRIES[0]);
  const [days, setDays] = React.useState(7);
  const [query, setQuery] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  React.useEffect(() => {
    document.querySelector(".layout")?.classList.toggle("page-blur", processing);
    return () => document.querySelector(".layout")?.classList.remove("page-blur");
  }, [processing]);
  const isUS = country.iso === "us";
  const INBOUND_FREE = 50;        // free inbound SMS for US numbers
  const INBOUND_RATE = 0.03;      // per inbound SMS after the free quota (US only)

  const isPrivate = type === "Private";
  // Different pricing plans per type: private bills by the week (country rate); shared bills by the day (service rate).
  // Longer plans get a discount vs. the shortest (per-period) plan.
  const unit = isPrivate ? country.rent : svc.price;
  const plans = isPrivate
    ? [{ label: "1 Month", days: 30, off: 0 }, { label: "3 Months", days: 90, off: 0.10 }, { label: "6 Months", days: 180, off: 0.18 }, { label: "12 Months", days: 360, off: 0.30 }]
    : [{ label: "1 Week", days: 7, off: 0 }, { label: "2 Weeks", days: 14, off: 0.07 }, { label: "1 Month", days: 30, off: 0.15 }];
  const priceFor = (p) => +((isPrivate ? unit * (p.days / 7) : unit * p.days) * (1 - p.off)).toFixed(2);
  const plan = plans.find((p) => p.days === days) || plans[0];
  const total = priceFor(plan);
  React.useEffect(() => { setDays(isPrivate ? 30 : 7); }, [type]);
  const filteredSvc = SERVICES.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  // dynamic step numbers — shared: type → country → service → plan; private: type → country → pick number → plan
  const step = { type: 1, country: 2, svc: 3, number: 3, duration: 4 };

  // ---- private number picker (US adds a state selector) ----
  const [usState, setUsState] = React.useState("CA");
  const [batch, setBatch] = React.useState(1);
  const [picked, setPicked] = React.useState(null);
  const availNumbers = React.useMemo(() => genAvailableNumbers(country.iso, isUS ? usState : null, batch), [country.iso, usState, batch, isUS]);
  // reset pick when the pool changes; default to the first number
  React.useEffect(() => { setPicked(availNumbers[0]); }, [availNumbers]);
  React.useEffect(() => { setBatch(1); }, [country.iso, usState]);
  const stateName = (US_STATES.find((s) => s[0] === usState) || US_STATES[4])[1];

  // Confirm → show loading → register the new number → redirect to My Numbers
  const confirmPurchase = () => {
    if (!agreed || processing) return;
    setProcessing(true);
    setTimeout(() => {
      const newId = Math.max(0, ...NUMBERS.map((n) => n.id)) + 1;
      const number = isPrivate && picked ? picked : `${country.code} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`;
      NUMBERS.unshift({ id: newId, number, iso: country.iso, country: country.name, service: isPrivate ? null : svc.name, type, provider: "ZEDSMS", days, status: "active", unread: 0 });
      openNumber ? openNumber(newId) : setRoute("numbers");
    }, 1900);
  };

  return (
    <div className="view-enter buy-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* type */}
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}><span style={{ color: "var(--accent)" }}>{step.type}.</span>&nbsp; Number type</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { k: "Private", d: "A full private number. Works with any service — priced by country.", caps: [{ icon: "msg", label: "SMS" }, { icon: "phone", label: "Voice" }] },
              { k: "Shared", d: "A number for one specific service. Cheaper, from a shared pool.", caps: [{ icon: "inbox", label: "Receive SMS" }] },
            ].map((t) => {
              const sel = type === t.k;
              return (
                <button key={t.k} onClick={() => setType(t.k)} style={{ padding: "15px 16px", borderRadius: 12, textAlign: "left",
                  background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}`, transition: "all 0.14s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{t.k}</span>
                    {sel && <span style={{ marginLeft: "auto", width: 19, height: 19, borderRadius: 99, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={12} strokeWidth={3} style={{ color: "#fff" }} /></span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, minHeight: 36 }}>{t.d}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 11 }}>
                    {t.caps.map((c) => (
                      <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 24, padding: "0 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: sel ? "var(--surface)" : "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                        <span style={{ display: "flex", color: "var(--accent)" }}><Icon name={c.icon} size={12} strokeWidth={2} /></span>{c.label}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* country */}
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}><span style={{ color: "var(--accent)" }}>{step.country}.</span>&nbsp; Choose a country</h3>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--text-faint)" }}>{isPrivate ? "Each country has its own rate — your plan price updates when you pick one." : "Pick where the number is based."}</p>
          <div className="country-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {COUNTRIES.map((c) => {
              const sel = country.iso === c.iso;
              return (
                <button key={c.iso} onClick={() => setCountry(c)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: 12,
                  background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}`, transition: "all 0.14s", textAlign: "left" }}>
                  <FlagAvatar iso={c.iso} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div className="mono tnum" style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{c.code}</div>
                  </div>
                  {sel && <span style={{ width: 19, height: 19, borderRadius: 99, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={12} strokeWidth={3} style={{ color: "#fff" }} /></span>}
                </button>
              );
            })}
          </div>
        </Card>

        {/* pick a number — only for private numbers */}
        {isPrivate && (
          <Card style={{ padding: 18 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}><span style={{ color: "var(--accent)" }}>{step.number}.</span>&nbsp; Pick your number</h3>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "var(--text-faint)" }}>{isUS ? "Choose a state first — numbers use that state's area code." : "These numbers are available right now. The one you pick is yours."}</p>

            {isUS && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <label style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 500, flexShrink: 0 }}>State</label>
                <StateSelect value={usState} onChange={setUsState} />
                <span className="mono tnum desktop-only" style={{ fontSize: 12, color: "var(--text-faint)", whiteSpace: "nowrap" }}>area code ({(US_STATES.find((s) => s[0] === usState) || [])[2]})</span>
              </div>
            )}

            <div className="country-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {availNumbers.map((n) => {
                const sel = picked === n;
                return (
                  <button key={n} onClick={() => setPicked(n)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 13px", borderRadius: 12,
                    background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}`, transition: "all 0.14s", textAlign: "left" }}>
                    <span style={{ width: 19, height: 19, borderRadius: 99, border: `2px solid ${sel ? "var(--accent)" : "var(--border-strong)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: sel ? "var(--accent)" : "transparent" }}>{sel && <Icon name="check" size={11} strokeWidth={3} style={{ color: "#fff" }} />}</span>
                    <span className="mono tnum" style={{ fontSize: 13, fontWeight: 550, color: sel ? "var(--accent)" : "var(--text)", whiteSpace: "nowrap" }}>{n}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 13 }}>
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{isUS ? `Available in ${stateName}` : `Available in ${country.name}`}</span>
              <Button variant="subtle" size="sm" icon="refresh" onClick={() => setBatch((b) => b + 1)}>Show different numbers</Button>
            </div>
          </Card>
        )}

        {/* service — only for shared numbers */}
        {!isPrivate && (
          <Card style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}><span style={{ color: "var(--accent)" }}>{step.svc}.</span>&nbsp; Choose a service</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 7, height: 32, padding: "0 11px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-faint)" }}>
                <Icon name="search" size={14} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", fontSize: 12.5, width: 110 }} />
              </div>
            </div>
            <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, maxHeight: 296, overflowY: "auto", paddingRight: 4, marginRight: -4 }}>
              {filteredSvc.map((s) => {
                const sel = svc.id === s.id;
                return (
                  <button key={s.id} onClick={() => setSvc(s)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, padding: "16px 8px", borderRadius: 13,
                    background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}`, transition: "all 0.14s" }}>
                    <ServiceAvatar color={s.color} letter={s.letter} size={40} />
                    <span style={{ fontSize: 12.5, fontWeight: 500 }}>{s.name}</span>
                    <span className="mono tnum" style={{ fontSize: 11.5, color: sel ? "var(--accent)" : "var(--text-faint)" }}>${s.price.toFixed(2)}/day</span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* plan */}
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}><span style={{ color: "var(--accent)" }}>{step.duration}.</span>&nbsp; Plan</h3>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: 10 }}>
            {plans.map((p) => {
              const sel = days === p.days;
              return (
                <button key={p.days} onClick={() => setDays(p.days)} style={{ position: "relative", padding: "14px 12px", borderRadius: 12, textAlign: "left",
                  background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}`, transition: "all 0.14s" }}>
                  {p.off > 0 && (
                    <span className="tnum" style={{ position: "absolute", top: 9, right: 9, fontSize: 10, fontWeight: 700, letterSpacing: "0.02em", color: "var(--success)", background: "var(--success-soft)", padding: "2px 6px", borderRadius: 999 }}>{Math.round(p.off * 100)}% OFF</span>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.label}</span>
                    {sel && p.off === 0 && <span style={{ marginLeft: "auto", width: 17, height: 17, borderRadius: 99, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={11} strokeWidth={3} style={{ color: "#fff" }} /></span>}
                  </div>
                  <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600, color: sel ? "var(--accent)" : "var(--text-muted)" }}>${priceFor(p).toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* summary */}
      <Card style={{ padding: 18, position: "sticky", top: 82 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Order summary</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px", borderRadius: 12, background: "var(--surface-2)", marginBottom: 16 }}>
          {isPrivate ? <FlagAvatar iso={country.iso} size={42} /> : <ServiceAvatar color={svc.color} letter={svc.letter} size={42} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={isPrivate ? "mono tnum" : undefined} style={{ fontSize: 14, fontWeight: 550, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isPrivate ? (picked || "Pick a number") : svc.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}><FlagAvatar iso={country.iso} size={15} /> {isUS && isPrivate ? `${stateName}, United States` : country.name}{isPrivate ? " · Private" : " · Shared"}</div>
          </div>
        </div>
        {[
          ["Type", type],
          ["Capabilities", (
            <span style={{ display: "inline-flex", gap: 5 }}>
              {(isPrivate ? [{ i: "msg", l: "SMS" }, { i: "phone", l: "Voice" }] : [{ i: "inbox", l: "Receive SMS" }]).map((c) => (
                <span key={c.l} style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 22, padding: "0 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 600, background: "var(--accent-soft)", color: "var(--accent)" }}>
                  <span style={{ display: "flex" }}><Icon name={c.i} size={11} strokeWidth={2} /></span>{c.l}
                </span>
              ))}
            </span>
          )],
          ["Plan", (plans.find((p) => p.days === days) || {}).label || `${days} days`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", fontSize: 13 }}>
            <span style={{ color: "var(--text-muted)" }}>{k}</span>
            <span className="tnum" style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{v}</span>
          </div>
        ))}
        <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Total</span>
          <span className="mono tnum" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>${total.toFixed(2)}</span>
        </div>

        {/* policy notices — set expectations before purchase to avoid disputes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: "12px 13px", borderRadius: 11, background: "var(--surface-2)", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8, fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
            <span style={{ display: "flex", flexShrink: 0, marginTop: 1, color: "var(--text-faint)" }}><Icon name="info" size={14} /></span>
            <span>Deliverability isn't guaranteed for every platform. Some services may not accept this number — we can't promise codes will arrive everywhere.</span>
          </div>
          {isUS && (
            <div style={{ display: "flex", gap: 8, fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.5, paddingTop: 9, borderTop: "1px solid var(--border)" }}>
              <span style={{ display: "flex", flexShrink: 0, marginTop: 1, color: "var(--text-faint)" }}><Icon name="inbox" size={14} /></span>
              <span>US numbers include <strong style={{ color: "var(--text)" }} className="tnum">{INBOUND_FREE} free inbound SMS</strong>. After that, inbound messages are billed at <span className="tnum">${INBOUND_RATE.toFixed(2)}</span> each.</span>
            </div>
          )}
        </div>

        {/* terms agreement gate */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: 16, height: 16, marginTop: 1, accentColor: "var(--accent)", flexShrink: 0, cursor: "pointer" }} />
          <span style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.5 }}>I agree to the <a href="terms.html#terms" target="_blank" rel="noopener" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "underline" }}>Terms &amp; Conditions</a> and <a href="terms.html#usage" target="_blank" rel="noopener" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "underline" }}>Usage Policy</a>.</span>
        </label>

        <Button full size="lg" icon="cart" disabled={!agreed || processing} onClick={confirmPurchase}>{processing ? "Processing…" : "Confirm purchase"}</Button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: "var(--text-faint)" }}>
          <Icon name="shield" size={13} /> Pays from your ${USER.balance.toFixed(2)} balance
        </div>
      </Card>

      {/* processing overlay → then redirect to My Numbers. Portaled to <body> so it sits outside .layout and stays sharp while the page blurs behind it. */}
      {processing && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(8,9,12,0.32)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.18s ease" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, boxShadow: "var(--shadow-pop)", padding: "34px 44px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, minWidth: 300, animation: "popIn 0.2s ease" }}>
            <span style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--surface-3)", borderTopColor: "var(--accent)", animation: "spin 0.7s linear infinite" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>Processing your purchase…</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 5 }}>Assigning your {isPrivate ? country.name : svc.name} number</div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ============ TOP UP ============
const TopUpScreen = () => {
  const [amount, setAmount] = React.useState(25);
  const [method, setMethod] = React.useState("card");
  const presets = [10, 25, 50, 100];
  const methods = [
    { id: "card", name: "Credit / Debit card", icon: "wallet",
      tagline: "Pay with a bank card — no crypto needed",
      desc: "Charge a Visa or Mastercard directly. Funds clear into your wallet the instant the card is approved. The simplest option if you don't hold any cryptocurrency.",
      best: "No crypto",
      speed: "Instant", fee: "+3% card fee",
      brand: { label: "via Stripe", color: "#635BFF" },
      tags: [
        { name: "Visa", color: "#1A1F71" }, { name: "Mastercard", color: "#EB001B" },
      ] },
    { id: "mixpay", name: "MixPay", icon: "qr",
      tagline: "Pay from Binance, Gate, KuCoin, Bybit & more",
      desc: "On the MixPay checkout, choose Crypto to pay any coin, or pay in one tap from a wallet app — Binance Pay, Gate Pay, KuCoin Pay or Bybit Pay. MixPay auto-converts to your balance, so you don't have to match the exact coin. Most wallet payments confirm in about a minute.",
      best: "Binance & wallet users",
      speed: "~1 min", fee: "Network fee only",
      brand: { label: "via mixpay.me", color: "#1652F0" },
      tags: [
        { name: "Crypto", color: "#F7931A" }, { name: "Binance Pay", color: "#F0B90B" },
        { name: "Gate Pay", color: "#2354E6" }, { name: "KuCoin Pay", color: "#23AF91" },
        { name: "Bybit Pay", color: "#16171A" }, { name: "USDT", color: "#26A17B" },
        { name: "BTC", color: "#F7931A" },
      ] },
    { id: "nowpayments", name: "NOWPayments", icon: "coins",
      tagline: "Send any of 300+ coins from any wallet",
      desc: "A non-custodial gateway: pick a coin, get a deposit address, and send from any self-custody wallet. Ideal for less common tokens or privacy coins where you want full control over the transfer.",
      best: "Any coin · self-custody",
      speed: "~10 min", fee: "Network fee only",
      brand: { label: "via nowpayments.io", color: "#266EF8" },
      tags: [
        { name: "BTC", color: "#F7931A" }, { name: "ETH", color: "#627EEA" },
        { name: "USDT", color: "#26A17B" }, { name: "USDC", color: "#2775CA" },
        { name: "XMR", color: "#FF6600" }, { name: "LTC", color: "#345D9D" },
        { name: "+300 coins", color: "#6B6F76" },
      ] },
  ];
  const activeMethod = methods.find((m) => m.id === method) || methods[0];
  const WalletChip = ({ t }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 25, padding: "0 9px 0 8px", borderRadius: 7, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 11.5, fontWeight: 500, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: t.color, flexShrink: 0 }} />
      {t.name}
    </span>
  );
  const MetaStat = ({ icon, label, value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
      <span style={{ display: "flex", color: "var(--text-faint)", flexShrink: 0 }}><Icon name={icon} size={14} strokeWidth={1.8} /></span>
      <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}><span style={{ color: "var(--text-faint)" }}>{label} </span><span style={{ fontWeight: 550, color: "var(--text)" }}>{value}</span></span>
    </div>
  );
  return (
    <div className="view-enter buy-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Choose amount</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
            {presets.map((p) => (
              <button key={p} onClick={() => setAmount(p)} className="mono tnum" style={{ height: 56, borderRadius: 12, fontSize: 17, fontWeight: 600,
                background: amount === p ? "var(--accent-soft)" : "var(--surface)", color: amount === p ? "var(--accent)" : "var(--text)", border: `1px solid ${amount === p ? "var(--accent-border)" : "var(--border)"}` }}>${p}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 15px", height: 54, borderRadius: 12, border: "1px solid var(--border-strong)", background: "var(--surface)" }}>
            <span className="mono" style={{ fontSize: 20, color: "var(--text-faint)" }}>$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(Math.max(0, +e.target.value))} className="mono tnum" style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", fontSize: 20, fontWeight: 600, width: "100%" }} />
            <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>USD</span>
          </div>
        </Card>
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Payment method</h3>
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>3 ways to pay</span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--text-muted)" }}>Pick whichever suits you — card if you don't use crypto, MixPay for Binance &amp; wallet apps, or NOWPayments to send any coin yourself.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {methods.map((m) => {
              const sel = method === m.id;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{ display: "block", width: "100%", padding: 0, borderRadius: 14, textAlign: "left",
                  background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}`,
                  boxShadow: sel ? "0 1px 2px rgba(16,17,26,0.04)" : "none", transition: "background 0.16s ease, border-color 0.16s ease", overflow: "hidden" }}>
                  {/* header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "14px 15px 0" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: sel ? "var(--surface)" : "var(--surface-2)", border: sel ? "1px solid var(--accent-border)" : "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: sel ? "var(--accent)" : "var(--text-muted)", flexShrink: 0 }}><Icon name={m.icon} size={20} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{m.name}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: m.brand.color, background: "color-mix(in srgb, var(--surface-2) 60%, transparent)", border: "1px solid var(--border)", padding: "1px 7px", borderRadius: 6 }}>{m.brand.label}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{m.tagline}</div>
                    </div>
                    <span style={{ width: 19, height: 19, borderRadius: 99, border: `2px solid ${sel ? "var(--accent)" : "var(--border-strong)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, background: sel ? "var(--accent)" : "transparent" }}>{sel && <Icon name="check" size={12} strokeWidth={3} style={{ color: "#fff" }} />}</span>
                  </div>
                  {/* meta strip */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", padding: "12px 15px 0 68px" }}>
                    <MetaStat icon="bolt" label="Speed" value={m.speed} />
                    <MetaStat icon="receipt" label="Fee" value={m.fee} />
                    <MetaStat icon="check" label="Best for" value={m.best} />
                  </div>
                  {/* description — only on selected */}
                  {sel && (
                    <div style={{ padding: "12px 15px 0 68px", animation: "fadeIn 0.2s ease both" }}>
                      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--text-muted)" }}>{m.desc}</p>
                    </div>
                  )}
                  {/* supported wallets / coins / cards */}
                  <div style={{ padding: "12px 15px 15px 68px" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 8 }}>{m.id === "card" ? "Accepted cards" : "Accepted via this gateway"}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {m.tags.map((t) => <WalletChip key={t.name} t={t} />)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginTop: 14, padding: "11px 13px", borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <span style={{ display: "flex", color: "var(--text-faint)", marginTop: 1, flexShrink: 0 }}><Icon name="shield" size={15} /></span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>Crypto payments are processed by the gateway — ZEDSMS never holds your wallet keys. Balance is credited automatically once the network confirms.</span>
          </div>
        </Card>
      </div>
      <Card style={{ padding: 18, position: "sticky", top: 82 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Summary</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)", marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}><Icon name={activeMethod.icon} size={17} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{activeMethod.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Paying · {activeMethod.speed}</div>
          </div>
        </div>
        {(() => {
          const fee = method === "card" ? +(amount * 0.03).toFixed(2) : 0;
          const total = amount + fee;
          return (
            <>
              {[["Current balance", `$${USER.balance.toFixed(2)}`], ["Top up", `$${amount.toFixed(2)}`], [method === "card" ? "Card fee (3%)" : "Network fee", method === "card" ? `$${fee.toFixed(2)}` : "Paid in coin"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}><span style={{ color: "var(--text-muted)" }}>{k}</span><span className="tnum" style={{ fontWeight: 500 }}>{v}</span></div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}><span style={{ color: "var(--text-muted)" }}>You pay</span><span className="mono tnum" style={{ fontWeight: 600 }}>${total.toFixed(2)}</span></div>
              <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>New balance</span>
                <span className="mono tnum" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>${(USER.balance + amount).toFixed(2)}</span>
              </div>
              <Button full size="lg" icon={method === "card" ? "wallet" : "qr"}>{method === "card" ? `Pay $${total.toFixed(2)}` : `Continue to ${activeMethod.name}`}</Button>
            </>
          );
        })()}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: "var(--text-faint)" }}>
          <Icon name="shield" size={13} /> Secured by {activeMethod.brand.label.replace("via ", "")}
        </div>
      </Card>
    </div>
  );
};

// ============ TRANSFER ============
const RECENT_RECIPIENTS = [
  { id: "16565956596", name: "Maya Okonkwo", email: "maya.ok@gmail.com", color: "#7C5CE0" },
  { id: "33186655072", name: "Dev Patel", email: "dev.patel@proton.me", color: "#0E9384" },
  { id: "90241187340", name: "Lena Fischer", email: "lena.f@gmail.com", color: "#D6453A" },
];

const TransferScreen = () => {
  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState(10);
  const presets = [5, 10, 25];

  const matched = RECENT_RECIPIENTS.find(
    (r) => r.id.toLowerCase() === recipient.trim().toLowerCase() || r.email.toLowerCase() === recipient.trim().toLowerCase()
  );
  const overBalance = amount > USER.balance;
  const valid = recipient.trim().length > 3 && amount > 0 && !overBalance;
  const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const Field = ({ label, hint, children }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7 }}>
        <label style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 500 }}>{label}</label>
        {hint && <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
  const input = { width: "100%", height: 46, padding: "0 14px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none" };

  return (
    <div className="view-enter buy-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="transfer" size={20} /></div>
            <div><h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Send balance</h3><p style={{ margin: 0, fontSize: 12.5, color: "var(--text-muted)" }}>Instant &amp; free between ZEDSMS wallets</p></div>
          </div>

          <Field label="Recipient" hint="ZEDSMS ID or email">
            <div style={{ position: "relative" }}>
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. 16565956596 or email" style={{ ...input, paddingRight: matched ? 44 : 14, borderColor: matched ? "var(--success)" : "var(--border-strong)" }} />
              {matched && <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: 99, background: "var(--success-soft)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={13} strokeWidth={2.6} /></span>}
            </div>
            {matched && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "10px 12px", borderRadius: 11, background: "var(--success-soft)", border: "1px solid color-mix(in srgb, var(--success) 22%, transparent)", animation: "fadeIn 0.18s ease both" }}>
                <div style={{ width: 32, height: 32, borderRadius: 99, background: matched.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 12, flexShrink: 0 }}>{initials(matched.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{matched.name}</div>
                  <div className="mono" style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{matched.id}</div>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--success)" }}>Verified</span>
              </div>
            )}
          </Field>

          <Field label="Recent recipients">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {RECENT_RECIPIENTS.map((r) => {
                const on = matched && matched.id === r.id;
                return (
                  <button key={r.id} onClick={() => setRecipient(r.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px 6px 7px", borderRadius: 99, background: on ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${on ? "var(--accent-border)" : "var(--border)"}` }}>
                    <span style={{ width: 24, height: 24, borderRadius: 99, background: r.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 10.5, flexShrink: 0 }}>{initials(r.name)}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: on ? "var(--accent)" : "var(--text)" }}>{r.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Amount" hint={`Available $${USER.balance.toFixed(2)}`}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
              {presets.map((p) => (
                <button key={p} onClick={() => setAmount(p)} className="mono tnum" style={{ height: 42, borderRadius: 10, fontSize: 14, fontWeight: 600,
                  background: amount === p ? "var(--accent-soft)" : "var(--surface)", color: amount === p ? "var(--accent)" : "var(--text)", border: `1px solid ${amount === p ? "var(--accent-border)" : "var(--border)"}` }}>${p}</button>
              ))}
              <button onClick={() => setAmount(+USER.balance.toFixed(2))} className="tnum" style={{ height: 42, borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                background: amount === +USER.balance.toFixed(2) ? "var(--accent-soft)" : "var(--surface)", color: amount === +USER.balance.toFixed(2) ? "var(--accent)" : "var(--text)", border: `1px solid ${amount === +USER.balance.toFixed(2) ? "var(--accent-border)" : "var(--border)"}` }}>MAX</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px", height: 54, borderRadius: 12, border: `1px solid ${overBalance ? "var(--danger)" : "var(--border-strong)"}` }}>
              <span className="mono" style={{ fontSize: 19, color: "var(--text-faint)" }}>$</span>
              <input type="number" value={amount} onChange={(e) => setAmount(Math.max(0, +e.target.value))} className="mono tnum" style={{ border: "none", background: "transparent", outline: "none", color: "var(--text)", fontSize: 19, fontWeight: 600, width: "100%" }} />
              <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>USD</span>
            </div>
            {overBalance && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--danger)", marginTop: 7 }}><Icon name="info" size={13} /> Amount exceeds your available balance</div>}
          </Field>
        </Card>
      </div>

      <Card style={{ padding: 18, position: "sticky", top: 82 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Review transfer</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)", marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: matched ? matched.color : "var(--surface-3)", color: matched ? "#fff" : "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 11.5, flexShrink: 0 }}>{matched ? initials(matched.name) : <Icon name="phone" size={15} />}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{matched ? matched.name : "No recipient yet"}</div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{matched ? matched.id : "Enter an ID or email"}</div>
          </div>
        </div>
        {[["Available balance", `$${USER.balance.toFixed(2)}`], ["Sending", `$${amount.toFixed(2)}`], ["Transfer fee", "Free"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13 }}><span style={{ color: "var(--text-muted)" }}>{k}</span><span className="tnum" style={{ fontWeight: 500, color: v === "Free" ? "var(--success)" : "var(--text)" }}>{v}</span></div>
        ))}
        <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Balance after</span>
          <span className="mono tnum" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: overBalance ? "var(--danger)" : "var(--text)" }}>${Math.max(0, USER.balance - amount).toFixed(2)}</span>
        </div>
        <Button full size="lg" icon="send" disabled={!valid}>Send ${amount.toFixed(2)}</Button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: 11.5, color: "var(--text-faint)" }}>
          <Icon name="bolt" size={13} /> Arrives instantly · no fees
        </div>
      </Card>
    </div>
  );
};

// ============ TRANSACTIONS ============
const TransactionsScreen = () => {
  const [filter, setFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 8;
  const statusMap = { 0: { l: "Pending", t: "warning" }, 1: { l: "Complete", t: "success" }, 2: { l: "Partial", t: "accent" }, 3: { l: "Declined", t: "danger" } };
  const all = TRANSACTIONS.filter((t) => filter === "all" ? true : filter === "in" ? t.amount > 0 : t.amount < 0);
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const curPage = Math.min(page, totalPages);
  const rows = all.slice((curPage - 1) * PER_PAGE, curPage * PER_PAGE);
  const setFilterReset = (id) => { setFilter(id); setPage(1); };
  const rangeStart = all.length === 0 ? 0 : (curPage - 1) * PER_PAGE + 1;
  const rangeEnd = Math.min(curPage * PER_PAGE, all.length);
  const Tab = ({ id, label }) => (
    <button onClick={() => setFilterReset(id)} style={{ height: 30, padding: "0 13px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
      background: filter === id ? "var(--surface)" : "transparent", color: filter === id ? "var(--text)" : "var(--text-muted)", boxShadow: filter === id ? "var(--shadow-sm)" : "none", border: filter === id ? "1px solid var(--border)" : "1px solid transparent" }}>{label}</button>
  );
  const PageBtn = ({ children, onClick, disabled, active }) => (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, padding: "0 8px", borderRadius: 8, fontSize: 13, fontWeight: 550,
      background: active ? "var(--accent)" : "var(--surface)", color: active ? "#fff" : "var(--text)", border: `1px solid ${active ? "transparent" : "var(--border)"}`,
      display: "inline-flex", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", pointerEvents: disabled ? "none" : undefined }}>{children}</button>
  );
  return (
    <div className="view-enter">
      <Card style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 4, padding: 3, background: "var(--surface-2)", borderRadius: 10 }}>
            <Tab id="all" label="All" /><Tab id="in" label="Incoming" /><Tab id="out" label="Outgoing" />
          </div>
          <Button variant="ghost" size="sm" icon="receipt">Export CSV</Button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Date", "Action", "Description", "Amount", "Status"].map((h, i) => (
                  <th key={h} style={{ textAlign: i >= 3 ? "right" : "left", padding: "11px 18px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-faint)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const s = statusMap[t.status];
                return (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="mono tnum" style={{ padding: "14px 18px", fontSize: 12.5, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{t.date}</td>
                    <td style={{ padding: "14px 18px", fontSize: 13, fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: t.amount > 0 ? "var(--success-soft)" : "var(--surface-2)", color: t.amount > 0 ? "var(--success)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon name={t.amount > 0 ? "arrowDown" : "arrowUp"} size={14} strokeWidth={2} />
                        </span>
                        {t.action}
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: 12.5, color: "var(--text-muted)" }}>{t.desc}</td>
                    <td className="mono tnum" style={{ padding: "14px 18px", fontSize: 13, fontWeight: 600, textAlign: "right", color: t.amount > 0 ? "var(--success)" : "var(--text)", whiteSpace: "nowrap" }}>{t.amount > 0 ? "+" : "−"}${Math.abs(t.amount).toFixed(2)}</td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}><Badge tone={s.t}>{s.l}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderTop: "1px solid var(--border)", flexWrap: "wrap", gap: 12 }}>
          <span className="tnum" style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Showing <span style={{ fontWeight: 600, color: "var(--text)" }}>{rangeStart}–{rangeEnd}</span> of {all.length}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <PageBtn onClick={() => setPage(curPage - 1)} disabled={curPage === 1}><Icon name="chevR" size={15} style={{ transform: "rotate(180deg)" }} /></PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PageBtn key={p} onClick={() => setPage(p)} active={p === curPage}>{p}</PageBtn>
            ))}
            <PageBtn onClick={() => setPage(curPage + 1)} disabled={curPage === totalPages}><Icon name="chevR" size={15} /></PageBtn>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============ SETTINGS ============
const SettingsScreen = ({ theme, toggleTheme, onLogout }) => {
  const [tab, setTab] = React.useState("profile");
  const tabs = [{ id: "profile", label: "Profile" }, { id: "security", label: "Security" }, { id: "appearance", label: "Appearance" }, { id: "notifications", label: "Notifications" }];
  const input = { width: "100%", height: 44, padding: "0 14px", borderRadius: 11, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none" };
  const Field = ({ label, children }) => (<div style={{ marginBottom: 16 }}><label style={{ fontSize: 12.5, color: "var(--text-muted)", display: "block", marginBottom: 7, fontWeight: 500 }}>{label}</label>{children}</div>);
  const Row = ({ title, sub, children }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid var(--border)" }}>
      <div><div style={{ fontSize: 13.5, fontWeight: 500 }}>{title}</div><div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div></div>
      {children}
    </div>
  );
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 99, background: on ? "var(--accent)" : "var(--surface-3)", padding: 3, transition: "background 0.18s", flexShrink: 0 }}>
      <span style={{ display: "block", width: 18, height: 18, borderRadius: 99, background: "#fff", transform: on ? "translateX(18px)" : "none", transition: "transform 0.18s", boxShadow: "var(--shadow-sm)" }} />
    </button>
  );
  // password input with show/hide toggle
  const PasswordField = ({ value, defaultValue, onChange, placeholder, invalid }) => {
    const [show, setShow] = React.useState(false);
    return (
      <div style={{ position: "relative" }}>
        <input type={show ? "text" : "password"} value={value} defaultValue={defaultValue} onChange={onChange} placeholder={placeholder}
          style={{ ...input, paddingRight: 46, borderColor: invalid ? "var(--danger)" : "var(--border-strong)" }} />
        <button type="button" onClick={() => setShow((s) => !s)} title={show ? "Hide password" : "Show password"} tabIndex={-1}
          style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: show ? "var(--accent)" : "var(--text-faint)", transition: "color 0.14s" }}>
          <Icon name={show ? "eyeOff" : "eye"} size={17} />
        </button>
      </div>
    );
  };
  const [newPwd, setNewPwd] = React.useState("");
  const [confirmPwd, setConfirmPwd] = React.useState("");
  const pwScore = (p) => { if (!p) return 0; let s = 0; if (p.length >= 8) s++; if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return Math.min(s, 4); };
  const PW_LEVELS = [{ l: "Too short", c: "var(--danger)" }, { l: "Weak", c: "var(--danger)" }, { l: "Fair", c: "var(--warning)" }, { l: "Good", c: "var(--accent)" }, { l: "Strong", c: "var(--success)" }];
  const [toggles, setToggles] = React.useState({ codes: true, marketing: false, expiry: true, twofa: true });
  const flip = (k) => setToggles((p) => ({ ...p, [k]: !p[k] }));

  // ---- two-factor authentication flow ----
  const [twofa, setTwofa] = React.useState(false);
  const [tfaFlow, setTfaFlow] = React.useState(null); // "enable" | "disable" | null
  const [tfaStep, setTfaStep] = React.useState(0);     // enable: 0 scan · 1 verify
  const [tfaCode, setTfaCode] = React.useState("");
  const [tfaPwd, setTfaPwd] = React.useState("");
  const [tfaErr, setTfaErr] = React.useState("");
  const TFA_SECRET = "JBSWY3DPEHPK3PXP";

  const openEnable = () => { setTfaFlow("enable"); setTfaStep(0); setTfaCode(""); setTfaErr(""); };
  const openDisable = () => { setTfaFlow("disable"); setTfaPwd(""); setTfaErr(""); };
  const closeTfa = () => setTfaFlow(null);
  const verifyEnable = () => {
    if (tfaCode.replace(/\s/g, "").length !== 6) { setTfaErr("Enter the 6-digit code from your app."); return; }
    setTfaErr(""); setTwofa(true); setTfaFlow(null);
  };
  const confirmDisable = () => {
    if (tfaPwd.length < 4) { setTfaErr("Enter your account password to confirm."); return; }
    setTwofa(false); setTfaFlow(null);
  };

  // pseudo-QR placeholder (squares only) — deterministic finder patterns + noise
  const QRPlaceholder = ({ size = 156, n = 21 }) => {
    const cells = [];
    const finder = (r, c, br, bc) => { const dr = r - br, dc = c - bc; if (dr < 0 || dc < 0 || dr > 6 || dc > 6) return null; const edge = dr === 0 || dr === 6 || dc === 0 || dc === 6; const inner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4; return edge || inner; };
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      let on = null;
      for (const [br, bc] of [[0, 0], [0, n - 7], [n - 7, 0]]) { const f = finder(r, c, br, bc); if (f !== null) { on = f; break; } }
      if (on === null) { const near = (r < 8 && c < 8) || (r < 8 && c > n - 9) || (r > n - 9 && c < 8); if (near) on = false; else { const h = Math.sin((r + 1) * 12.9898 + (c + 1) * 78.233) * 43758.5453; on = (h - Math.floor(h)) > 0.52; } }
      cells.push(on);
    }
    return (
      <div style={{ width: size, height: size, padding: 9, borderRadius: 12, background: "#fff", border: "1px solid var(--border-strong)", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, width: "100%", height: "100%", gap: 0 }}>
          {cells.map((on, i) => <div key={i} style={{ background: on ? "#15171C" : "transparent" }} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="view-enter settings-layout" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>
      <div className="settings-tabs" style={{ display: "flex", flexDirection: "column", gap: 3, position: "sticky", top: 82 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", padding: "9px 13px", borderRadius: 10, fontSize: 13.5, fontWeight: tab === t.id ? 550 : 450, textAlign: "left",
            background: tab === t.id ? "var(--accent-soft)" : "transparent", color: tab === t.id ? "var(--accent)" : "var(--text-muted)" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 560 }}>
        {tab === "profile" && (
          <Card style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 22 }}>
              <div style={{ width: 60, height: 60, borderRadius: 99, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 24 }}>{userInitial}</div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{USER.email}</div>
                <div className="mono" style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 1 }}>ID {USER.zedId}</div>
              </div>
            </div>
            <Field label="Email"><input defaultValue={USER.email} type="email" style={input} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="ZEDSMS ID"><input value={USER.zedId} readOnly className="mono" style={{ ...input, color: "var(--text-muted)", cursor: "default" }} /></Field>
              <Field label="Signed in with">
                {(() => {
                  const lm = LOGIN_METHODS[USER.loginMethod] || LOGIN_METHODS.email;
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 9, height: 44, padding: "0 14px", borderRadius: 11, border: "1px solid var(--border)", background: "var(--surface-2)" }}>
                      <span style={{ width: 9, height: 9, borderRadius: 99, background: lm.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{lm.label}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--success)" }}>Connected</span>
                    </div>
                  );
                })()}
              </Field>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 18, padding: "11px 13px", borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <span style={{ display: "flex", color: "var(--text-faint)", marginTop: 1, flexShrink: 0 }}><Icon name="info" size={15} /></span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>ZEDSMS accounts don't use a display name — your email and ZEDSMS ID identify you. Your ID is permanent and used to receive balance transfers.</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}><Button>Save changes</Button><Button variant="subtle">Cancel</Button></div>
          </Card>
        )}
        {tab === "profile" && (
          <Card style={{ padding: 22, marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 600 }}>Sign out</h3>
                <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-muted)" }}>End your session on this device. You'll need to sign back in to access your account.</p>
              </div>
              <Button variant="danger" icon="logout" onClick={onLogout} style={{ flexShrink: 0 }}>Log out</Button>
            </div>
          </Card>
        )}
        {tab === "security" && (
          <Card style={{ padding: 22 }}>
            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <h3 style={{ margin: "0 0 3px", fontSize: 16, fontWeight: 600 }}>Password</h3>
              <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "var(--text-muted)" }}>Use at least 8 characters. You'll stay signed in on this device.</p>
            </div>
            <Field label="Current password"><PasswordField defaultValue="password" /></Field>
            <Field label="New password">
              <PasswordField value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="At least 8 characters" />
              {newPwd && (() => {
                const score = pwScore(newPwd); const lvl = PW_LEVELS[score];
                return (
                  <div style={{ marginTop: 9 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[0, 1, 2, 3].map((i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 99, background: i < score ? lvl.c : "var(--surface-3)", transition: "background 0.2s" }} />)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, fontSize: 11.5, color: lvl.c, fontWeight: 500 }}>
                      <span>{lvl.l}</span>
                      <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>· mix upper/lowercase, numbers &amp; symbols</span>
                    </div>
                  </div>
                );
              })()}
            </Field>
            <Field label="Confirm new password">
              <PasswordField value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="Re-enter new password" invalid={confirmPwd && confirmPwd !== newPwd} />
              {confirmPwd && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, fontSize: 11.5, fontWeight: 500, color: confirmPwd === newPwd ? "var(--success)" : "var(--danger)" }}>
                  <Icon name={confirmPwd === newPwd ? "check" : "info"} size={13} strokeWidth={2.2} />
                  {confirmPwd === newPwd ? "Passwords match" : "Passwords don't match"}
                </div>
              )}
            </Field>
            <div style={{ marginTop: 6, marginBottom: 22 }}><Button disabled={!(newPwd.length >= 8 && newPwd === confirmPwd)}>Update password</Button></div>

            <div style={{ height: 1, background: "var(--border)", margin: "0 0 20px" }} />

            {/* Two-factor authentication */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: twofa ? "var(--success-soft)" : "var(--surface-2)", color: twofa ? "var(--success)" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}><Icon name="shield" size={20} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600 }}>Two-factor authentication</h3>
                  <Badge tone={twofa ? "success" : "neutral"} dot>{twofa ? "On" : "Off"}</Badge>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>Add a second step at sign-in using an authenticator app like Google Authenticator, Authy or 1Password. Even if your password leaks, your account stays protected.</p>
              </div>
            </div>
            <div style={{ marginTop: 14, marginLeft: 53 }}>
              {twofa ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)", flex: 1, minWidth: 200 }}>
                    <Icon name="check" size={15} strokeWidth={2.4} style={{ color: "var(--success)" }} />
                    <span style={{ fontSize: 12.5, color: "var(--text)" }}>Authenticator app · added today</span>
                  </div>
                  <Button variant="danger" size="md" onClick={openDisable}>Disable</Button>
                </div>
              ) : (
                <Button variant="primary" size="md" icon="shield" onClick={openEnable}>Enable two-factor</Button>
              )}
            </div>
          </Card>
        )}
        {tab === "appearance" && (
          <Card style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Appearance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
              {[{ id: "light", label: "Light", icon: "sun" }, { id: "dark", label: "Dark", icon: "moon" }].map((m) => {
                const sel = theme === m.id;
                return (
                  <button key={m.id} onClick={() => { if (theme !== m.id) toggleTheme(); }} style={{ padding: 16, borderRadius: 14, textAlign: "left",
                    background: sel ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${sel ? "var(--accent-border)" : "var(--border)"}` }}>
                    <div style={{ height: 64, borderRadius: 10, marginBottom: 12, background: m.id === "light" ? "#FAFAFB" : "#0A0B0E", border: "1px solid var(--border)", display: "flex", padding: 8, gap: 6 }}>
                      <div style={{ width: 18, borderRadius: 4, background: m.id === "light" ? "#FFF" : "#181A21", border: "1px solid var(--border)" }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ height: 7, width: "60%", borderRadius: 3, background: "var(--accent)" }} />
                        <div style={{ height: 6, width: "85%", borderRadius: 3, background: m.id === "light" ? "#EEE" : "#23262E" }} />
                        <div style={{ height: 6, width: "70%", borderRadius: 3, background: m.id === "light" ? "#EEE" : "#23262E" }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name={m.icon} size={16} /><span style={{ fontSize: 13.5, fontWeight: 550 }}>{m.label}</span>{sel && <span style={{ marginLeft: "auto", color: "var(--accent)" }}><Icon name="check" size={16} strokeWidth={2.2} /></span>}</div>
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "4px 2px 0" }}>You can also switch theme any time from the top bar.</p>
          </Card>
        )}
        {tab === "notifications" && <NotificationsSettings />}
      </div>

      {/* ===== Enable 2FA flow ===== */}
      <Modal open={tfaFlow === "enable"} onClose={closeTfa} width={460}
        title={tfaStep === 0 ? "Set up authenticator" : "Verify your app"}
        subtitle={tfaStep === 0 ? "Step 1 of 2 · Scan the code" : "Step 2 of 2 · Confirm it works"}>
        {/* step dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {[0, 1].map((s) => <div key={s} style={{ height: 4, flex: 1, borderRadius: 99, background: s <= tfaStep ? "var(--accent)" : "var(--surface-3)", transition: "background 0.2s" }} />)}
        </div>

        {tfaStep === 0 && (
          <div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <QRPlaceholder />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>Open your authenticator app and scan this QR code, or enter the key manually.</p>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 6 }}>Setup key</div>
                <CodeChip code={TFA_SECRET} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <Button variant="subtle" full onClick={closeTfa}>Cancel</Button>
              <Button full iconRight="arrowR" onClick={() => { setTfaStep(1); setTfaErr(""); }}>Continue</Button>
            </div>
          </div>
        )}

        {tfaStep === 1 && (
          <div>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>Enter the 6-digit code currently shown in your authenticator app.</p>
            <input value={tfaCode} onChange={(e) => { setTfaCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6)); setTfaErr(""); }} inputMode="numeric" placeholder="000000" autoFocus
              className="mono tnum" style={{ ...input, height: 56, fontSize: 26, fontWeight: 600, textAlign: "center", letterSpacing: "0.4em", borderColor: tfaErr ? "var(--danger)" : "var(--border-strong)" }} />
            {tfaErr && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--danger)", marginTop: 9 }}><Icon name="info" size={13} /> {tfaErr}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <Button variant="subtle" full onClick={() => { setTfaStep(0); setTfaErr(""); }}>Back</Button>
              <Button full onClick={verifyEnable}>Verify &amp; enable</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ===== Disable 2FA flow ===== */}
      <Modal open={tfaFlow === "disable"} onClose={closeTfa} width={420}
        title="Disable two-factor?" subtitle="This makes your account less secure">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 16, padding: "11px 13px", borderRadius: 11, background: "var(--danger-soft)", border: "1px solid color-mix(in srgb, var(--danger) 22%, transparent)" }}>
          <span style={{ display: "flex", color: "var(--danger)", marginTop: 1, flexShrink: 0 }}><Icon name="shield" size={15} /></span>
          <span style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>You'll only need your password to sign in — no second step. You can re-enable two-factor at any time.</span>
        </div>
        <Field label="Confirm your password to continue">
          <PasswordField value={tfaPwd} onChange={(e) => { setTfaPwd(e.target.value); setTfaErr(""); }} placeholder="Your account password" invalid={!!tfaErr} />
        </Field>
        {tfaErr && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--danger)", marginTop: -8, marginBottom: 8 }}><Icon name="info" size={13} /> {tfaErr}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Button variant="subtle" full onClick={closeTfa}>Keep enabled</Button>
          <Button variant="danger" full onClick={confirmDisable}>Disable 2FA</Button>
        </div>
      </Modal>
    </div>
  );
};

export { BuyScreen, TopUpScreen, TransferScreen, TransactionsScreen, SettingsScreen };
